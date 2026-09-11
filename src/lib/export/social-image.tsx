import "server-only";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
// A static `.wasm` import is precompiled by @cloudflare/vite-plugin into a
// WebAssembly.Module at build time -- workerd disallows compiling WASM from
// bytes at request time, so this can't be a runtime fetch instead. (satori
// was tried first for this feature but dropped: its harfbuzz dependency
// needs Emscripten's addFunction, which itself compiles a small WASM
// trampoline at runtime -- also blocked by workerd, with no clean fix. Hand
// -authoring SVG and rasterizing with resvg alone avoids that entirely,
// since resvg's own text shaping is compiled into this same module.)
import RESVG_WASM from "@resvg/resvg-wasm/index_bg.wasm";
import { fetchAsset } from "@/lib/export/assets";
import type { RosterPosition } from "@/lib/export/roster";

export type SocialSize = "ig-post" | "ig-story" | "fb-post";

export const SOCIAL_SIZES: Record<SocialSize, { width: number; height: number; label: string }> = {
  "ig-post": { width: 1080, height: 1080, label: "Instagram post" },
  "ig-story": { width: 1080, height: 1920, label: "Instagram story" },
  "fb-post": { width: 1200, height: 630, label: "Facebook post" },
};

const MAX_NAMES_PER_POSITION = 6;
const LOGO_ASPECT = 823 / 1910; // native rbyaelectionstransparent.png ratio

let wasmReady: Promise<void> | null = null;
function ensureResvgWasm(): Promise<void> {
  // initWasm() throws if called twice, which happens under dev-server HMR
  // when this module reloads (resetting `wasmReady`) but resvg-wasm's own
  // internal module-level state doesn't. Harmless either way -- the wasm is
  // ready in both cases -- so treat that specific error as success.
  wasmReady ??= initWasm(RESVG_WASM).catch((err: unknown) => {
    if (err instanceof Error && err.message.includes("Already initialized")) return;
    throw err;
  });
  return wasmReady;
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Draws the whole roster at a given scale and reports where it ended up.
// Called twice: once at scale 1 purely to measure the real height this
// content needs (using the exact same arithmetic as the real draw, so the
// measurement can't drift from reality), then again at whatever scale keeps
// that height inside the canvas.
function layoutRoster(
  opts: {
    width: number;
    height: number;
    mode: "candidates" | "results";
    title: string;
    roster: RosterPosition[];
    logoDataUrl: string;
  },
  scale: number,
): { parts: string[]; endY: number } {
  const { width, mode, title, roster, logoDataUrl } = opts;
  const unit = width / 1080;
  const pad = 96 * unit;

  const labelSize = 24 * unit * scale;
  const nameSize = 30 * unit * scale;
  const rowGap = 26 * unit * scale;
  const nameLineHeight = nameSize * 1.35;

  const parts: string[] = [];
  let y = pad;
  const logoW = 180 * unit * scale;
  const logoH = logoW * LOGO_ASPECT;
  parts.push(`<image x="${pad}" y="${y}" width="${logoW}" height="${logoH}" href="${logoDataUrl}" />`);
  y += logoH + 36 * unit * scale;

  const titleSize = 52 * unit * scale;
  y += titleSize;
  parts.push(
    `<text x="${pad}" y="${y}" font-family="Noto Sans" font-weight="700" font-size="${titleSize}" fill="#0f172a">${escapeXml(title)}</text>`,
  );
  y += 40 * unit * scale;

  const contentRight = width - pad;
  for (const row of roster) {
    y += labelSize;
    parts.push(
      `<text x="${pad}" y="${y}" font-family="Noto Sans" font-weight="700" font-size="${labelSize}" letter-spacing="1.5" fill="#64748b">${escapeXml(row.positionLabel.toUpperCase())}</text>`,
    );
    y += labelSize * 0.5;

    if (row.names.length === 0) {
      y += nameLineHeight;
      parts.push(
        `<text x="${pad}" y="${y}" font-family="Noto Sans" font-weight="700" font-size="${nameSize}" fill="#94a3b8">Vacant</text>`,
      );
    } else {
      const shown = row.names.slice(0, MAX_NAMES_PER_POSITION);
      for (const n of shown) {
        y += nameLineHeight;
        const label = mode === "candidates" && n.church ? `${n.name} — ${n.church}` : n.name;
        parts.push(
          `<text x="${pad}" y="${y}" font-family="Noto Sans" font-weight="700" font-size="${nameSize}" fill="#0f172a">${escapeXml(label)}</text>`,
        );
      }
      const extra = row.names.length - shown.length;
      if (extra > 0) {
        y += nameLineHeight;
        parts.push(
          `<text x="${pad}" y="${y}" font-family="Noto Sans" font-weight="400" font-size="${nameSize * 0.85}" fill="#94a3b8">+${extra} more</text>`,
        );
      }
    }

    y += rowGap * 0.6;
    parts.push(`<line x1="${pad}" y1="${y}" x2="${contentRight}" y2="${y}" stroke="#e2e8f0" stroke-width="2" />`);
    y += rowGap;
  }

  return { parts, endY: y };
}

export async function buildRosterSocialImage(opts: {
  origin: string;
  size: SocialSize;
  year: number;
  mode: "candidates" | "results";
  roster: RosterPosition[];
}): Promise<Uint8Array> {
  const { width, height } = SOCIAL_SIZES[opts.size];
  const unit = width / 1080;
  const pad = 96 * unit;

  const [logoBytes, regularBytes, boldBytes] = await Promise.all([
    fetchAsset(opts.origin, "/rbyaelectionstransparent.png"),
    fetchAsset(opts.origin, "/fonts/NotoSans-Regular.ttf"),
    fetchAsset(opts.origin, "/fonts/NotoSans-Bold.ttf"),
    ensureResvgWasm(),
  ]);

  const logoDataUrl = `data:image/png;base64,${toBase64(logoBytes)}`;
  const title = opts.mode === "candidates" ? `${opts.year} Candidates` : `${opts.year} Election Results`;
  const layoutOpts = { width, height, mode: opts.mode, title, roster: opts.roster, logoDataUrl };
  const stripeH = 14 * unit;

  // Footer sits a fixed gap below the canvas bottom, at its own baseline --
  // reserve enough room above that baseline for the footer's own text
  // height (ascenders reach well above a baseline, not just below it) plus
  // a visual gap, so it can never collide with the last content line. Tied
  // to the same constants used to actually place the footer below, so the
  // reserve can't drift out of sync with where the text really is.
  const footerSize = 24 * unit;
  const footerBottomMargin = pad / 2;
  const footerY = height - footerBottomMargin;
  const footerClearance = footerSize * 1.5; // ascender height + breathing room
  const footerReserve = footerBottomMargin + footerClearance;
  const available = height - stripeH - footerReserve;

  // Shrink everything uniformly if the roster wouldn't otherwise fit --
  // measured with the exact same arithmetic that produces the real
  // drawing, not a separate estimate.
  const { endY: naturalEndY } = layoutRoster(layoutOpts, 1);
  const scale =
    naturalEndY > available ? Math.max(0.3, (available - pad) / (naturalEndY - pad)) : 1;

  const { parts: content, endY } = layoutRoster(layoutOpts, scale);
  // Center the content block in whatever vertical room is left over -- a
  // short roster on the tall Story canvas would otherwise sit awkwardly at
  // the top with a big gap before the footer.
  const centerOffset = Math.max(0, (available - endY) / 2);

  const parts: string[] = [];
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" />`);
  const stripeW = width / 3;
  parts.push(`<rect x="0" y="0" width="${stripeW}" height="${stripeH}" fill="#dc2626" />`);
  parts.push(`<rect x="${stripeW}" y="0" width="${stripeW}" height="${stripeH}" fill="#eab308" />`);
  parts.push(`<rect x="${stripeW * 2}" y="0" width="${stripeW}" height="${stripeH}" fill="#1d4ed8" />`);
  parts.push(`<g transform="translate(0, ${stripeH + centerOffset})">${content.join("")}</g>`);

  parts.push(
    `<text x="${width / 2}" y="${footerY}" font-family="Noto Sans" font-weight="400" font-size="${footerSize}" fill="#94a3b8" text-anchor="middle">rbya.org/elections</text>`,
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join("")}</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      fontBuffers: [new Uint8Array(regularBytes), new Uint8Array(boldBytes)],
      loadSystemFonts: false,
      defaultFontFamily: "Noto Sans",
    },
  });
  return resvg.render().asPng();
}
