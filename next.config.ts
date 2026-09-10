import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only our own static, hand-authored SVG logo goes through next/image
    // -- no user-uploaded SVGs use this path.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
