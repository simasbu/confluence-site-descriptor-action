import * as core from '@actions/core';
import * as fs from 'fs-extra';
import { getDirectoryTree } from './directory-tree';
import { getSiteDefinition, SiteDefinition } from './site-definition';
import { checkForNamingViolations, replaceUnderscoresWithSpaces } from './utils';

async function run(): Promise<void> {
  try {
    const localDirectory = core.getInput('localDirectory', { required: true });
    const outputDirectory = core.getInput('outputDirectory', { required: false });
    const parentPageTitle = core.getInput('parentPageTitle', { required: true });
    const homePageTitle = core.getInput('homePageTitle', { required: true });
    const spaceKey = core.getInput('spaceKey', { required: true });

    checkForNamingViolations(localDirectory);

    const directoryTree = getDirectoryTree(localDirectory, homePageTitle);

    const rootDefinition: SiteDefinition = {
      uri: 'README.md',
      parentPageTitle,
      name: replaceUnderscoresWithSpaces(homePageTitle),
    };
    const home = getSiteDefinition(directoryTree, rootDefinition, outputDirectory);

    let outputPath = '';
    if (outputDirectory) {
      fs.ensureDirSync(outputDirectory);
      outputPath = `${outputDirectory}/`;
    }
    console.log(JSON.stringify({ spaceKey, home }));
    fs.writeFileSync(`${outputPath}site.yaml`, JSON.stringify({ spaceKey, home }));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
