import * as fs from 'fs'
import * as YAML from 'yaml'
import {Attachment, SiteDescriptor} from './SiteDescriptor'

interface FolderTree {
  name: string
  path: string
  children: FolderTree[]
  isDirectory?: boolean
}

/**
 * Builds a hierarchical representation of a directory.
 */
export function buildFolderTree(rootPath: string): FolderTree {
  const root: FolderTree = {
    name: '',
    path: rootPath,
    children: [],
    isDirectory: true
  }
  const stack = [root]

  while (stack.length) {
    const currentNode = stack.pop()

    if (currentNode) {
      const children = fs.readdirSync(currentNode.path)

      for (const child of children) {
        const childPath = `${currentNode.path}/${child}`

        const childNode: FolderTree = {
          name: child,
          path: childPath,
          children: []
        }

        childNode.isDirectory = fs.statSync(childNode.path).isDirectory()
        currentNode.children.push(childNode)

        if (fs.statSync(childNode.path).isDirectory()) {
          stack.push(childNode)
        }
      }
    }
  }
  return root
}

/**
 *
 * @param {FolderTree} folderTreeNode
 * @param {SiteDescriptor} siteNode
 */
export function buildSiteNode(
  folderTreeNode: FolderTree,
  siteNode: SiteDescriptor
): SiteDescriptor {
  if (folderTreeNode.isDirectory) {
    siteNode.name = replaceUnderscore(folderTreeNode.name)
    siteNode.uri = `${folderTreeNode.path}/README.md`

    siteNode.labels = folderTreeNode.children
      .filter(child => child.name === 'labels.yaml')
      .map(child => fs.readFileSync(child.path, {encoding: 'utf8'}))
      .map(yaml => YAML.parse(yaml))
      .reduce((x, y) => x.concat(y), [])

    siteNode.children = folderTreeNode.children
      .filter(child => child.isDirectory)
      .filter(child => child.name !== 'attachments')
      .map(child => buildSiteNode(child, {} as SiteDescriptor))

    siteNode.attachments = folderTreeNode.children
      .filter(child => child.isDirectory)
      .filter(child => child.name === 'attachments')
      .map(child => {
        const attachment: Attachment = {
          uri: child.path,
          comment: 'files',
          version: '1'
        }
        return attachment
      })
  }
  return siteNode
}

/**
 *
 * @param {string} text
 */
export function replaceUnderscore(text: string): string {
  return text.replace(/_/g, ' ').trim()
}
