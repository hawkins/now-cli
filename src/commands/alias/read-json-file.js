// @flow
import fs from 'fs';
import { CantParseJSONFile } from '../../util/errors';

async function readJSONFile(
  file: string
): Promise<Object | null | CantParseJSONFile> {
  const content = await readFileSafe(file);
  if (content === null) {
    return content;
  }

  try {
    const json = JSON.parse(content);
    return json;
  } catch (error) {
    return new CantParseJSONFile(file);
  }
}

async function readFileSafe(file: string): Promise<string | null> {
  return fs.existsSync(file) ? await fs.promises.readFile(file) : null;
}

export default readJSONFile;
