// Native
const { join: joinPath } = require('path');

// Packages
const loadJSON = require('load-json-file');
const writeJSON = require('write-json-file');
const { existsSync } = require('fs');

// Utilities
const getNowDir = require('./global-path');
const getLocalPathConfig = require('./local-path');
const error = require('../output/error');

const NOW_DIR = getNowDir();
const CONFIG_FILE_PATH = joinPath(NOW_DIR, 'config.json');
const AUTH_CONFIG_FILE_PATH = joinPath(NOW_DIR, 'auth.json');

// reads `CONFIG_FILE_PATH` atomically
const readConfigFile = () => loadJSON.sync(CONFIG_FILE_PATH);

// writes whatever's in `stuff` to `CONFIG_FILE_PATH`, atomically
const writeToConfigFile = stuff =>
  writeJSON.sync(CONFIG_FILE_PATH, stuff, { indent: 2 });

// reads `AUTH_CONFIG_FILE_PATH` atomically
const readAuthConfigFile = () => loadJSON.sync(AUTH_CONFIG_FILE_PATH);

// writes whatever's in `stuff` to `AUTH_CONFIG_FILE_PATH`, atomically
const writeToAuthConfigFile = stuff =>
  writeJSON.sync(AUTH_CONFIG_FILE_PATH, stuff, { indent: 2, mode: 0o600 });

function getConfigFilePath() {
  return CONFIG_FILE_PATH;
}

function getAuthConfigFilePath() {
  return AUTH_CONFIG_FILE_PATH;
}

function readLocalConfig(prefix) {
  const target = getLocalPathConfig(prefix || process.cwd());
  let localConfigExists;

  try {
    localConfigExists = existsSync(target);
  } catch (err) {
    console.error(error('Failed to check if `now.json` exists'));
    process.exit(1);
  }

  if (localConfigExists) {
    try {
      return loadJSON.sync(target);
    } catch (err) {
      if (err.name === 'JSONError') {
        console.log(error(err.message));
      } else {
        const code = err.code ? `(${err.code})` : '';
        console.error(error(`Failed to read the \`now.json\` file ${code}`));
      }

      process.exit(1);
    }
  }

  return null;
}

module.exports = {
  readConfigFile,
  writeToConfigFile,
  readAuthConfigFile,
  writeToAuthConfigFile,
  readLocalConfig,
  getConfigFilePath,
  getAuthConfigFilePath
};
