import directoryTree, { DirectoryTree } from 'directory-tree';

/**
 * Builds an hierarchical representation of the provided directory.
 * @param rootPath The root path of the directory.
 * @param name The name of the directory tree.
 */
export function getDirectoryTree(rootPath: string, name: string): DirectoryTree {
  const tree: DirectoryTree = {
    ...directoryTree(rootPath),
    name,
  };

  return tree;
}
