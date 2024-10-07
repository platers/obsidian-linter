
import {normalizePath, Notice, Plugin, requestUrl, RequestUrlResponse} from 'obsidian';
import {logError, logWarn} from './logger';
import {getTextInLanguage} from 'src/lang/helpers';

const defaultCustomMisspellingsFileName = 'default-misspellings.md';
const defaultCustomAutoCorrectMisspellingsLocations = `https://raw.githubusercontent.com/platers/obsidian-linter/refs/heads/master/src/utils/${defaultCustomMisspellingsFileName}`;

export async function downloadMisspellings(plugin: Plugin, disableCustomAutoCorrect: (message: string) => Promise<void>): Promise<void> {
  const app = plugin.app;
  const pluginDir = plugin.manifest.dir ?? '';
  const fullPath = normalizePath(pluginDir+ '/' + defaultCustomMisspellingsFileName);
  if (await app.vault.adapter.exists(fullPath)) {
    return;
  }

  const notice = new Notice(getTextInLanguage('rules.auto-correct-common-misspellings.default-install'));

  let response: RequestUrlResponse;
  try {
    response = await requestUrl(defaultCustomAutoCorrectMisspellingsLocations);
  } catch (error) {
    logError(getTextInLanguage('rules.auto-correct-common-misspellings.default-install-failed').replace('{URL}', defaultCustomAutoCorrectMisspellingsLocations), error);
  }

  if (!response || response.status !== 200) {
    const message = getTextInLanguage('rules.auto-correct-common-misspellings.default-install-failed').replace('{URL}', defaultCustomAutoCorrectMisspellingsLocations) + getTextInLanguage('logs.see-console');
    await disableCustomAutoCorrect(message);
    return;
  }

  // This should never happen, but just in case, we will check for this scenario
  if (!await app.vault.adapter.exists(pluginDir)) {
    await app.vault.adapter.mkdir(pluginDir);
  }
  await app.vault.adapter.writeBinary(fullPath, response.arrayBuffer);

  notice.hide();
}

export async function readInMisspellingsFile(plugin: Plugin): Promise<string> {
  const app = plugin.app;
  const pluginDir = plugin.manifest.dir ?? '';
  const fullPath = normalizePath(pluginDir+ '/' + defaultCustomMisspellingsFileName);
  if (!await app.vault.adapter.exists(fullPath)) {
    logWarn(getTextInLanguage('rules.auto-correct-common-misspellings.defaults-missing').replace('{FILE}', fullPath));
    return '';
  }

  return await app.vault.adapter.read(fullPath);
}
