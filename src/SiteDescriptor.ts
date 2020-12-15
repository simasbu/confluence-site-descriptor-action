export interface SiteDescriptor {
  uri: string
  parentPageTitle: string
  name: string
  labels?: []
  children?: SiteDescriptor[]
  attachments?: Attachment[]
}

export interface Attachment {
  uri: string
  comment: string
  version: string
}
