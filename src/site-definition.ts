import { DirectoryTree } from 'directory-tree';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { replaceUnderscoresWithSpaces } from './utils';

export interface SiteDefinition {
  uri: string;
  parentPageTitle: string;
  name: string;
  labels?: string[];
  children?: SiteDefinition[];
  attachments?: Attachment[];
}

interface Attachment {
  uri: string;
  name: string;
  comment: string;
  version: string;
}

/**
 * Generates the Site Definition object which will be consumed by the Confluence.
 * @param {DirectoryTree} directoryTree Directory tree object that needs to be mapped to the Site Definition object.
 * @param {SiteDefinition} siteDefinition Initial site definition.
 * @param {string} workingDirectory A prefix of the path that will be removed from the final uri value of each site definition entity.
 */
export function getSiteDefinition(
  { children = [], name, path, type }: DirectoryTree,
  siteDefinition: SiteDefinition,
  workingDirectory: string
): SiteDefinition {
  if (type === 'directory') {
    siteDefinition.name = replaceUnderscoresWithSpaces(name);
    siteDefinition.uri = getUri(path, workingDirectory);
    siteDefinition.labels = getLabels(children);
    siteDefinition.children = getChildren(children, workingDirectory);
    siteDefinition.attachments = getAttachments(children, workingDirectory);
  }

  return siteDefinition;
}

/**
 * Returns the list of attachments that may be found in the provided directory tree.
 * If no attachments are found returns `undefined`.
 * @param directoryTree The directory tree where the attachments will be searched for.
 * @param workingDirectory A prefix of the path that will be removed from the final uri value of each site definition entity.
 */
function getAttachments(
  directoryTree: DirectoryTree[],
  workingDirectory: string
): Attachment[] | undefined {
  const attachmentsDirectory = directoryTree.find(
    ({ name, type }) => name === 'attachments' && type === 'directory'
  );

  return attachmentsDirectory?.children?.map(({ path, name, type }) => ({
    uri: substringWorkingDirectory(path, workingDirectory),
    name,
    comment: type,
    version: '1',
  }));
}

/**
 * Returns the list of site definition entities that may be found in the provided directory tree.
 * If no entities are found returns `undefined`.
 * @param directoryTree The directory tree where the child entities will be searched for.
 * @param workingDirectory A prefix of the path that will be removed from the final uri value of each site definition entity.
 */
function getChildren(
  directoryTree: DirectoryTree[],
  workingDirectory: string
): SiteDefinition[] | undefined {
  const children = directoryTree
    .filter(({ type }) => type === 'directory')
    .filter(({ name }) => name !== 'attachments')
    .map(child => getSiteDefinition(child, {} as SiteDefinition, workingDirectory));

  return children.length ? children : undefined;
}

/**
 * Returns the list of labels from the `labels.yaml` file that may be found in the provided directory tree.
 * If no labels are found returns `undefined`.
 * @param directoryTree The directory tree where the `labels.yaml` file will be searched for.
 */
function getLabels(directoryTree: DirectoryTree[]): string[] | undefined {
  const labelsYaml = directoryTree.find(({ name }) => name === 'labels.yaml');

  return labelsYaml
    ? YAML.parse(fs.readFileSync(labelsYaml.path, { encoding: 'utf8' }))
    : undefined;
}

/**
 * Returns the uri for the the provided directory path. Uri will always have a `README.md` at the end.
 * @param directoryPath Directory path that needs to be converted to a uri.
 * @param workingDirectory A prefix of the path that will be removed from the final uri value of each site definition entity.
 */
function getUri(directoryPath: string, workingDirectory: string): string {
  if (directoryPath.startsWith(workingDirectory)) {
    const uri = `${substringWorkingDirectory(directoryPath, workingDirectory)}/README.md`;
    return uri.startsWith('/') ? uri.substring(1, uri.length) : uri;
  } else {
    return `${directoryPath}/README.md`;
  }
}

/**
 * Cuts the working directory path from the provided directory path and returns the result string.
 * @param directoryPath Directory path from which the working directory path should be removed.
 * @param workingDirectory A prefix of the path that will be removed from the final uri value of each site definition entity.
 */
function substringWorkingDirectory(directoryPath: string, workingDirectory: string): string {
  if (directoryPath.startsWith(workingDirectory)) {
    const newPath = directoryPath.substr(workingDirectory.length, directoryPath.length);
    return newPath.startsWith('/') ? newPath.substring(1, newPath.length) : newPath;
  } else {
    return directoryPath;
  }
}
