import confetti from 'canvas-confetti'

export function celebrate() {
  const colors = ['#F07A2B', '#FFE9A3', '#E7E6FB', '#FDE4DA', '#D9F3EE', '#1C1C1C']
  const base = { colors, disableForReducedMotion: true, zIndex: 100 }
  confetti({ ...base, particleCount: 90, spread: 75, origin: { y: 0.7 } })
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } }), 180)
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } }), 300)
  navigator.vibrate?.(30)
}
