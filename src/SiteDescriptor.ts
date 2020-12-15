type SiteDescriptor = {
  uri: string
  parentPageTitle: string
  name: string
  labels?: []
  children?: SiteDescriptor[]
  attachments?: Attachment[]
}

type Attachment = {
  uri: string
  comment: string
  version: string
}
