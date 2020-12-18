import { DirectoryTree } from 'directory-tree';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { replaceUnderscoresWithSpaces } from './utils';

export interface SiteDefinition {
  uri: string;
  parentPageTitle: string;
  name: string;
  labels?: [];
  children?: SiteDefinition[];
  attachments?: Attachment[];
}

interface Attachment {
  uri: string;
  comment: string;
  version: string;
}

/**
 * Generates the Site Definition object which will be consumed by the Confluence.
 * @param {DirectoryTree} directoryTree Directory tree object that needs to be mapped to the Site Definition object.
 * @param {SiteDefinition} siteDefinition Initial site definition.
 */
export function getSiteDefinition(
  directoryTree: DirectoryTree,
  siteDefinition: SiteDefinition,
  workingDirectory?: string
): SiteDefinition {
  if (directoryTree.type === 'directory') {
    const {
      children: childDirectories = [],
      name: directoryName,
      path: directoryPath,
    } = directoryTree;
    console.log(directoryPath);
    siteDefinition.name = replaceUnderscoresWithSpaces(directoryName);
    if (workingDirectory != null && directoryPath.startsWith(workingDirectory)) {
      siteDefinition.uri = `${directoryPath.substr(
        workingDirectory.length,
        directoryPath.length
      )}/README.md`;
    } else {
      siteDefinition.uri = `${directoryPath}/README.md`;
    }

    siteDefinition.labels = childDirectories
      .filter(({ name }) => name === 'labels.yaml')
      .map(({ path }) => fs.readFileSync(path, { encoding: 'utf8' }))
      .map(yaml => YAML.parse(yaml))
      .reduce((x, y) => x.concat(y), []);

    siteDefinition.children = childDirectories
      .filter(({ type }) => type === 'directory')
      .filter(({ name }) => name !== 'attachments')
      .map(child => getSiteDefinition(child, {} as SiteDefinition, workingDirectory));

    siteDefinition.attachments = childDirectories
      .filter(({ type }) => type === 'directory')
      .filter(({ name }) => name === 'attachments')
      .map(({ path }) => {
        const attachment: Attachment = {
          uri: path,
          comment: 'files',
          version: '1',
        };

        return attachment;
      });
  }

  return siteDefinition;
}
