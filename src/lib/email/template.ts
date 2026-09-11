import "server-only";

// Shared branded wrapper for transactional emails -- inline styles only,
// since email clients ignore <style> blocks and external stylesheets.
// System font stack (no web fonts: unreliable in email clients).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rbya.cloud";
const LOGO_URL = `${SITE_URL}/rbyaelectionstransparent.png`;

function button(href: string, label: string): string {
  return `
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${href}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        ${label}
      </a>
    </div>`;
}

export function renderEmailHtml(options: {
  paragraphs: string[];
  cta?: { href: string; label: string };
}): string {
  const body = options.paragraphs
    .map((p) => `<p style="margin:0 0 16px;">${p}</p>`)
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
  </head>
  <body style="margin:0;padding:32px 16px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="height:6px;background:linear-gradient(90deg,#dc2626 0%,#dc2626 33%,#eab308 33%,#eab308 66%,#1d4ed8 66%,#1d4ed8 100%);"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
        <tr>
          <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 32px 8px;">
            <img src="${LOGO_URL}" width="200" alt="RBYA Elections" style="max-width:200px;height:auto;display:block;" />
          </td>
        </tr>
      </table>
      <div style="padding:16px 32px 8px;color:#0f172a;font-size:15px;line-height:1.65;">
        ${body}
        ${options.cta ? button(options.cta.href, options.cta.label) : ""}
      </div>
      <div style="padding:24px 32px 28px;margin-top:8px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;line-height:1.7;text-align:center;">
        <p style="margin:0 0 6px;color:#475569;font-weight:600;">The RBYA Election Committee</p>
        <p style="margin:0;">
          <a href="https://www.rbya.org" style="color:#1d4ed8;text-decoration:none;">rbya.org</a>
          <span style="color:#cbd5e1;">&nbsp;&middot;&nbsp;</span>
          <a href="https://www.rbya.org/elections" style="color:#1d4ed8;text-decoration:none;">rbya.org/elections</a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}
