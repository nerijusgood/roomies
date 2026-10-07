import content from 'virtual:roomies-content'

// Open Peeps avatars (CC0) are generated at build time by plugins/content.ts, so they work offline
// and the avatar library is not shipped to phones.
export function avatarUri(personId: string): string {
  return content.avatars[personId] ?? ''
}
