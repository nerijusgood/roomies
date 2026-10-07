import rawConfig from '../../config.json'
import content from 'virtual:roomies-content'
import type { Area, Config, InfoPage, Person } from '@/shared/types'

export const config = rawConfig as Config
export const areas: Area[] = content.areas
export const infoPages: InfoPage[] = content.info

export const personById = (id: string): Person | undefined => config.people.find((p) => p.id === id)
export const areaById = (id: string | null | undefined): Area | undefined =>
  id ? areas.find((a) => a.id === id) : undefined
export const infoById = (id: string): InfoPage | undefined => infoPages.find((p) => p.id === id)
