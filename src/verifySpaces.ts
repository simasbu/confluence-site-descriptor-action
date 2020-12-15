import * as fs from 'fs'
import * as path from 'path'

export function verifySpaces(path: string): void {
  const directories = getDirectoriesRecursive(path).filter(c => /\s/.test(c))
  if (typeof directories !== 'undefined' && directories.length > 0) {
    console.log('Directories with spaces:')
    console.log(directories)
    throw new Error(
      `Directory ${directories[0]} contains spaces. Please replace spaces with "_"(underscore)`
    )
  }
}

function flatten(lists: any[]) {
  return lists.reduce((a, b) => a.concat(b), [])
}

function getDirectories(srcpath: string) {
  return fs
    .readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory())
}

function getDirectoriesRecursive(srcpath: string): [string, ...any[]] {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))
  ]
}
