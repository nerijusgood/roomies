export function greeting(now: Date) {
  const h = now.getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Hi'
  return 'Good evening'
}

const cheers = [
  'Nice one! The house thanks you.',
  'Done and dusted.',
  'Sparkling. Go enjoy your weekend.',
  'You legend. All done.',
  'Clean home, happy roomies.',
]
const nudges = ['A little care for the home this week.', 'Small steps, clean home.', 'Put on a playlist and go.']
const progress = ['Good start, keep going.', 'Almost halfway there.', 'More than halfway!', 'Nearly done, last bits.']

const pick = (list: string[], seed: string) => list[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % list.length]

export function cheer(seed: string) {
  return pick(cheers, seed)
}

export function motivation(done: number, total: number, seed: string) {
  if (total === 0) return 'Nothing on your list this week.'
  if (done >= total) return cheer(seed)
  if (done === 0) return pick(nudges, seed)
  const r = done / total
  return progress[r < 0.34 ? 0 : r < 0.5 ? 1 : r < 0.8 ? 2 : 3]
}
