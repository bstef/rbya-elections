import "server-only";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { fetchAsset } from "@/lib/export/assets";
import type { RosterPosition } from "@/lib/export/roster";

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const MARGIN = 56;

const NAVY = rgb(0.06, 0.09, 0.16);
const MUTED = rgb(0.42, 0.47, 0.55);
const RED = rgb(0.86, 0.15, 0.15);
const GOLD = rgb(0.92, 0.7, 0.03);
const BLUE = rgb(0.11, 0.3, 0.85);

export async function buildRosterPdf(opts: {
  origin: string;
  year: number;
  title: string;
  mode: "candidates" | "results";
  roster: RosterPosition[];
}): Promise<Uint8Array> {
  const [logoBytes, regularBytes, boldBytes] = await Promise.all([
    fetchAsset(opts.origin, "/rbyaelectionstransparent.png"),
    fetchAsset(opts.origin, "/fonts/NotoSans-Regular.ttf"),
    fetchAsset(opts.origin, "/fonts/NotoSans-Bold.ttf"),
  ]);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // subset: true drops most glyphs with this font (a known pdf-lib +
  // fontkit issue on large multi-script fonts like Noto Sans) -- embed the
  // full font instead. Costs file size, not correctness.
  const font = await pdfDoc.embedFont(regularBytes, { subset: false });
  const fontBold = await pdfDoc.embedFont(boldBytes, { subset: false });
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoScale = 130 / logoImage.width;
  const logoDims = { width: logoImage.width * logoScale, height: logoImage.height * logoScale };

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function newPage() {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(height: number) {
    if (y - height < MARGIN) newPage();
  }

  function text(value: string, x: number, size: number, f: PDFFont, color = NAVY) {
    page.drawText(value, { x, y, size, font: f, color });
  }

  // Header: logo, accent stripe, title.
  page.drawImage(logoImage, {
    x: MARGIN,
    y: y - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });
  y -= logoDims.height + 22;

  const stripeWidth = (PAGE_WIDTH - MARGIN * 2) / 3;
  page.drawRectangle({ x: MARGIN, y, width: stripeWidth, height: 4, color: RED });
  page.drawRectangle({ x: MARGIN + stripeWidth, y, width: stripeWidth, height: 4, color: GOLD });
  page.drawRectangle({ x: MARGIN + stripeWidth * 2, y, width: stripeWidth, height: 4, color: BLUE });
  y -= 26;

  text(`${opts.year} ${opts.title}`, MARGIN, 22, fontBold);
  y -= 32;

  for (const row of opts.roster) {
    ensureSpace(40);
    text(row.positionLabel, MARGIN, 14, fontBold);
    y -= 20;

    if (row.names.length === 0) {
      ensureSpace(18);
      text("Vacant -- no candidate cleared a majority.", MARGIN + 14, 11, font, MUTED);
      y -= 18;
    } else {
      for (const n of row.names) {
        ensureSpace(18);
        const line =
          opts.mode === "candidates"
            ? n.church
              ? `${n.name}  —  ${n.church}`
              : n.name
            : `${n.name}  —  ${n.votes} vote${n.votes === 1 ? "" : "s"} (${((n.voteShare ?? 0) * 100).toFixed(1)}%)`;
        text(line, MARGIN + 14, 11, font, rgb(0.15, 0.18, 0.25));
        y -= 18;
      }
    }
    y -= 12;
  }

  const pages: PDFPage[] = pdfDoc.getPages();
  for (const p of pages) {
    p.drawText(`Generated ${new Date().toLocaleDateString()} -- RBYA Election Committee`, {
      x: MARGIN,
      y: MARGIN - 24,
      size: 8,
      font,
      color: MUTED,
    });
  }

  return pdfDoc.save();
}
