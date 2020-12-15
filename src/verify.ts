import * as fs from 'fs'
import * as path from 'path'

export function verifySpaces(localDirectory: string): void {
  const directories = getDirectoriesRecursive(localDirectory).filter(c =>
    /\s/.test(c)
  )
  if (typeof directories !== 'undefined' && directories.length > 0) {
    throw new Error(
      `Directory ${directories[0]} contains spaces. Please replace spaces with "_"(underscore)`
    )
  }
}

function getDirectoriesRecursive(srcpath: string): string[] {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))
  ]
}

function flatten(lists: string[][]): string[] {
  return lists.reduce((a, b) => a.concat(b), [])
}

function getDirectories(srcpath: string): string[] {
  return fs
    .readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(p => fs.statSync(p).isDirectory())
}
