import type { SVGProps } from 'react'

/** Hand-drawn style line doodles (original, drawn for Roomies) in the Open Doodles spirit:
 *  black round strokes, white fills, one orange pop. */
const S = {
  fill: 'none',
  stroke: '#1C1C1C',
  strokeWidth: 2.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}
const W = '#FFFFFF'
const POP = '#F07A2B'

function Sofa() {
  return (
    <g {...S}>
      <path d="M26 50c0-11 5-16 16-16h36c11 0 16 5 16 16v6H26z" fill={W} />
      <path d="M40 50c0-6 3-8 9-8h6c5 0 7 3 7 8" fill={POP} />
      <path d="M18 56c0-5 3-8 7-8s7 3 7 8v20H18z" fill={W} />
      <path d="M88 56c0-5 3-8 7-8s7 3 7 8v20H88z" fill={W} />
      <path d="M32 62h56v14H32z" fill={W} />
      <path d="M60 62v14M24 76l-2 7M96 76l2 7" />
      <path d="M108 40c-4-6-2-13 4-16 1 7-1 12-4 16zm0 0c3-7 9-9 14-7-3 6-8 8-14 7z" fill={W} />
      <path d="M104 52h10l-2 12h-6z" fill={W} />
      <path d="M108 40v12" />
      <path d="M12 26l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" strokeWidth={2} />
    </g>
  )
}

function Pot() {
  return (
    <g {...S}>
      <path d="M50 22c-3 4 3 7 0 11M60 18c-3 5 3 8 0 13M70 22c-3 4 3 7 0 11" />
      <path d="M34 44h52" />
      <path d="M58 38h4" strokeWidth={5} />
      <path d="M38 44v24c0 6 4 10 10 10h24c6 0 10-4 10-10V44" fill={W} />
      <path d="M38 52h-8M82 52h8" />
      <path d="M44 60c6 3 26 3 32 0" />
      <path d="M30 86c20-4 40-4 60 0" />
      <path d="M96 30l10-12M104 22c3-4 8-4 9 0s-3 7-7 5" fill={POP} />
      <path d="M14 34l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" strokeWidth={2} />
    </g>
  )
}

function Bath() {
  return (
    <g {...S}>
      <path d="M28 20c0-6 8-6 8 0v24" />
      <path d="M36 22h8c4 0 6 3 6 6" />
      <path d="M44 30l-2 4M50 32v4M56 30l2 4" strokeWidth={2} />
      <path d="M18 48h84" />
      <path d="M22 48v10c0 10 8 18 18 18h40c10 0 18-8 18-18V48" fill={W} />
      <path d="M34 76l-4 8M86 76l4 8" />
      <circle cx="58" cy="42" r="6" fill={W} />
      <circle cx="70" cy="38" r="4" fill={W} />
      <circle cx="80" cy="42" r="5" fill={POP} />
      <path d="M100 26c4 0 6 2 6 6" strokeWidth={2} />
      <path d="M108 16l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" strokeWidth={2} />
    </g>
  )
}

function Door() {
  return (
    <g {...S}>
      <path d="M36 84V22c0-4 2-6 6-6h28c4 0 6 2 6 6v62" fill={W} />
      <path d="M44 28h24v20H44z" />
      <circle cx="68" cy="58" r="2.6" fill="#1C1C1C" />
      <path d="M28 84h56" />
      <path d="M40 84l2 4h28l2-4" fill={POP} />
      <path d="M92 30h18M98 30v6M104 30v6" />
      <path d="M94 36c-2 10 0 18 4 22h4c4-4 6-12 4-22z" fill={W} />
      <path d="M90 84l2-12h8l2 12" fill={W} />
      <path d="M96 72c-6-6-6-12 0-16M96 72c6-6 8-12 4-18" />
      <path d="M16 24l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" strokeWidth={2} />
    </g>
  )
}

function Broom() {
  return (
    <g {...S}>
      <path d="M84 12L52 58" />
      <path d="M46 52l14 10-8 20c-8 2-22-6-26-14z" fill={POP} />
      <path d="M36 74l10-12M44 80l8-14" strokeWidth={2} />
      <path d="M16 84c10-3 20-4 30-3" />
      <path d="M92 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM22 26l2 4 4 2-4 2-2 4-2-4-4-2 4-2zM100 76l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" strokeWidth={2} fill={W} />
    </g>
  )
}

function Sparkle() {
  return (
    <g {...S}>
      <path d="M60 18l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill={W} />
      <path d="M92 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM26 62l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={POP} strokeWidth={2} />
    </g>
  )
}

const DOODLES: Record<string, () => React.JSX.Element> = { sofa: Sofa, pot: Pot, bath: Bath, door: Door, broom: Broom, sparkle: Sparkle }

export function Doodle({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  const Cmp = DOODLES[name] ?? Sparkle
  return (
    <svg viewBox="0 0 128 96" aria-hidden="true" {...props}>
      <Cmp />
    </svg>
  )
}
