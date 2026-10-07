declare module 'virtual:roomies-content' {
  import type { Area, InfoPage } from './shared/types'
  const content: { areas: Area[]; info: InfoPage[]; avatars: Record<string, string> }
  export default content
}
