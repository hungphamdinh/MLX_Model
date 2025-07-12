import { logger, consoleTransport, fileAsyncTransport } from 'react-native-logs';
import RNFS from 'react-native-fs';
import { InteractionManager } from 'react-native';
import { ensureFolder, removeFile } from '../Utils/file';
import { zip } from 'react-native-zip-archive';

const logPath = `${RNFS.DocumentDirectoryPath}/logs`;
const defaultConfig = {
  transport: __DEV__ ? fileAsyncTransport : fileAsyncTransport,
  severity: 'debug',
  transportOptions: {
    FS: RNFS,
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
    filePath: logPath,
    fileName: `logs_{date-today}.txt`, // Create a new file every day
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
};

const logService = logger.createLogger(defaultConfig);

function getCurrentLogName() {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return `logs_${date}-${month}-${year}.txt`;
}

export const getCurrentFilePath = () => {
  const logName = getCurrentLogName();
  return `${logPath}/${logName}`;
};

export const zipCurrentLog = async () => {
  try {
    const zipFolder = `${logPath}/zip`;
    const zipPath = `${zipFolder}/attachment.zip`;
    const logFilePath = getCurrentFilePath();
    const logName = getCurrentLogName();
    const isExists = await RNFS.exists(logFilePath);
    if (!isExists) {
      return null;
    }
    await ensureFolder(`${logPath}/zip`);
    await RNFS.copyFile(logFilePath, `${logPath}/zip/${logName}`);
    await zip(zipFolder, zipPath);
    const base64String = await RNFS.readFile(zipPath, 'base64');
    await RNFS.unlink(zipFolder);
    return base64String;
  } catch (error) {
    logService.error(error);
    return null;
  }
};

export const clearOldLogs = async () => {
  await ensureFolder(logPath);
  const logFiles = await RNFS.readDir(logPath);
  const currentLog = getCurrentLogName();

  for (const logFile of logFiles) {
    if (logFile.isFile() && !logFile.name.endsWith(currentLog)) {
      await RNFS.unlink(logFile.path);
    }
  }
};

export default logService;
