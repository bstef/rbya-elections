export function RbyaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 620 160" role="img" aria-label="RBYA Elections" className={className}>
      <g transform="translate(12,12)">
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          strokeWidth="7"
          className="stroke-blue-950 dark:stroke-blue-100"
        />

        {/* Romanian-flag ribbon wrapping the base of the seal */}
        <path
          d="M 20.5 106 A 62 62 0 0 1 8.7 78"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="stroke-blue-800 dark:stroke-sky-400"
        />
        <path
          d="M 35.7 121.8 A 62 62 0 0 1 20.5 106"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="stroke-amber-400"
        />
        <path
          d="M 55.2 129.9 A 62 62 0 0 1 35.7 121.8"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="stroke-red-600 dark:stroke-red-500"
        />

        <path
          d="M 40 70 L 59 90 L 100 43"
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-blue-950 dark:stroke-blue-100"
        />
      </g>

      <text
        x="196"
        y="88"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight={700}
        fontSize={66}
        letterSpacing={1}
        className="fill-blue-950 dark:fill-blue-100"
      >
        RBYA
      </text>
      <text
        x="199"
        y="122"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize={26}
        letterSpacing={5}
        className="fill-blue-600 dark:fill-blue-300"
      >
        Elections
      </text>
    </svg>
  );
}
