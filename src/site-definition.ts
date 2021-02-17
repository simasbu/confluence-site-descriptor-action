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
 * @param {string} workingDirectory A prefix of the path that will be removed from the final uri value.
 */
export function getSiteDefinition(
  directoryTree: DirectoryTree,
  siteDefinition: SiteDefinition,
  workingDirectory?: string
): SiteDefinition {
  if (directoryTree.type === 'directory') {
    const {
      children: childEntities = [],
      name: directoryName,
      path: directoryPath,
    } = directoryTree;

    siteDefinition.name = replaceUnderscoresWithSpaces(directoryName);

    siteDefinition.uri = resolveSiteDefinitionUri(directoryPath, workingDirectory);

    const labelsYamlEntity = childEntities.find(({ name }) => name === 'labels.yaml');

    if (labelsYamlEntity) {
      const labelsFile = fs.readFileSync(labelsYamlEntity.path, { encoding: 'utf8' });

      siteDefinition.labels = YAML.parse(labelsFile);
    }

    siteDefinition.children = childEntities
      .filter(({ type }) => type === 'directory')
      .filter(({ name }) => name !== 'attachments')
      .map(child => getSiteDefinition(child, {} as SiteDefinition, workingDirectory));

    const attachmentsDirectory = childEntities.find(({ name }) => name === 'attachments');

    siteDefinition.attachments = attachmentsDirectory?.children?.map(({ path, name, type }) => ({
      uri: substringWorkingDirectory(path, workingDirectory),
      name,
      comment: type,
      version: '1',
    }));
  }

  return siteDefinition;
}

function resolveSiteDefinitionUri(directoryPath: string, workingDirectory?: string): string {
  if (workingDirectory != null && directoryPath.startsWith(workingDirectory)) {
    const uri = `${substringWorkingDirectory(directoryPath, workingDirectory)}/README.md`;
    return uri.startsWith('/') ? uri.substring(1, uri.length) : uri;
  } else {
    return `${directoryPath}/README.md`;
  }
}

function substringWorkingDirectory(directoryPath: string, workingDirectory?: string): string {
  if (workingDirectory != null && directoryPath.startsWith(workingDirectory)) {
    const newPath = directoryPath.substr(workingDirectory.length, directoryPath.length);
    return newPath.startsWith('/') ? newPath.substring(1, newPath.length) : newPath;
  } else {
    return directoryPath;
  }
}
