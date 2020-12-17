import * as glob from 'glob';

/**
 * Checks for violations that might exist within the provided directory path.
 * Keep in mind that due to malfunction of the [bsorrentino/maven-confluence-plugin](https://github.com/bsorrentino/maven-confluence-plugin) the naming of the pages can't be done via spaces. For now we agreed to replace the spaces with underscores.
 * @param rootPath Path of the directory that needs to be checked agains the naming convention.
 */
export function checkForNamingViolations(rootPath: string) {
  const WHITESPACE_REGEX = /\s/;
  const directoryWithViolations = glob
    .sync(`${rootPath}/**/`)
    .find(directory => WHITESPACE_REGEX.test(directory));

  if (directoryWithViolations) {
    throw new Error(
      `Directory ${directoryWithViolations} contains spaces. Please replace spaces with "_"(underscore)`
    );
  }
}
/**
 * Replaces underscores with spaces in the provided string and returns the outcome value back.
 * @param {string} text The string that needs to have underscores replaced with spaces.
 */
export function replaceUnderscoresWithSpaces(text: string): string {
  return text.replace(/_/g, ' ').trim();
}
