type FolderTree = {
  name: string
  path: string
  children: FolderTree[]
  isDirectory?: boolean
}
