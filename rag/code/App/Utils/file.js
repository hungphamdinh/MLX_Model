import _ from 'lodash';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { Image, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { generateGUID } from './number';
import { LIMIT_AZURE_FILE_SIZE, fileTypes } from '../Config/Constants';
import { ImageResource } from '../Themes';
import { icons } from '../Resources/icon';

const types = DocumentPicker.types;

export const getFileName = (path) => {
  if (_.size(path) > 0) {
    const arr = path.split('/');
    if (arr.length > 0) {
      return _.last(arr);
    }
  }
  return null;
};

export function getExtension(fileName) {
  if (fileName) {
    const arrText = fileName.split('.');
    let extension = arrText[arrText.length - 1];
    if (extension) {
      extension = extension.toLowerCase();
    }
    return `.${extension}`;
  }
  return '';
}

export async function ensureFolder(filePath) {
  const isExistFolder = await RNFS.exists(filePath);
  if (!isExistFolder) {
    await RNFS.mkdir(filePath);
    return false;
  }
  return true;
}

export async function removeFile(filePath) {
  const isExist = await RNFS.exists(filePath);
  if (isExist) {
    await RNFS.unlink(filePath);
  }
}

/**
 * resize image and move it to document folder
 * */
export async function resizeImage(file, MAX_SIZE = 1024) {
  const { uri, width, height, mime } = file;
  const sketchFolder = `${RNFS.DocumentDirectoryPath}/images`;
  await ensureFolder(sketchFolder);
  let resizedImage = {};
  let fileCopyUri = uri;
  if (width > MAX_SIZE || height > MAX_SIZE) {
    let resizedImageWidth = 0;
    let resizedImageHeight = 0;
    if (height >= width) {
      resizedImageHeight = MAX_SIZE;
      resizedImageWidth = (width * resizedImageHeight) / height;
    } else {
      resizedImageWidth = MAX_SIZE;
      resizedImageHeight = (height * resizedImageWidth) / width;
    }
    resizedImage = await ImageResizer.createResizedImage(
      Platform.OS === 'ios' ? `file://${uri}` : uri,
      resizedImageWidth,
      resizedImageHeight,
      'JPEG',
      80,
      0,
      null
    );

    fileCopyUri = resizedImage.uri;
  }
  const destPath = `${sketchFolder}/${generateGUID()}.jpg`;
  await RNFS.copyFile(fileCopyUri, destPath);

  return {
    ...file,
    fileName: convertHEICFile(file.fileName),
    size: resizedImage.size,
    mime: mime === 'image/heic' ? 'image/jpeg' : mime,
    path: `file://${destPath}`,
    uri: `file://${destPath}`,
  };
}

export function checkImageByMimeType(mime) {
  return _.includes(['image/jpeg', 'image/png', 'image/heic'], mime);
}

export function getDocumentType(item) {
  if (/^image\//.test(item.mimeType)) {
    return fileTypes.image;
  } else if (/^video\//.test(item.mimeType)) {
    return fileTypes.video;
  } else if (/^pdf\//.test(item.mimeType)) {
    return fileTypes.pdf;
  }
  return fileTypes.other;
}
export function mapDocumentItem(item, token) {
  const type = getDocumentType(item);
  if (type === fileTypes.image) {
    return item.uri || `${item.fileUrl}${token}`;
  } else if (type === fileTypes.video) {
    return ImageResource.IMG_LIBRARY_VIDEO;
  } else if (type === fileTypes.pdf) {
    return ImageResource.IMG_LIBRARY_PDF;
  }

  return ImageResource.IMG_LIBRARY_DEFAULT;
}

export const getDocumentIcon = (mimeType) => {
  let icon;
  switch (mimeType) {
    case 'image/png':
      icon = icons.imageLibrary;
      break;
    case 'image/jpeg':
      icon = icons.imageLibrary;
      break;
    case 'application/pdf':
      icon = icons.pdfLibrary;
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      icon = icons.word;
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      icon = icons.excel;
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      icon = icons.powerpoint;
      break;
    default:
      icon = icons.defaultLibrary;
      break;
  }
  return icon;
};

export const checkValidDocumentMimeType = (type) => {
  if (Platform.OS === 'ios') {
    return true;
  }
  if (type.indexOf('image/') > -1) {
    return true;
  }
  return _.includes([types.docx, types.doc, types.ppt, types.pptx, types.csv, types.xls, types.xlsx, types.pdf], type);
};

export async function getReactNativeFolderStructure(path) {
  try {
    const folderContents = await RNFS.readDir(path);
    const requests = folderContents.map(async (item) => {
      const children = item.isDirectory() ? await getReactNativeFolderStructure(item.path) : undefined;
      return {
        ...item,
        ...(children && { children }),
      };
    });
    return await Promise.all(requests);
  } catch (error) {
    return {};
  }
}

export const convertHEICFile = (fileName) => {
  if (fileName && typeof fileName === 'string') {
    fileName = fileName.replace(/(\.heic|\.HEIC|\.heif|\.HEIF)+/g, '.jpeg');
  }
  return fileName;
};

export const convertTypeHEICToJpg = (name, type) => {
  if (name.indexOf('heic') > -1 || name.indexOf('HEIC') > -1) {
    type = 'image/jpeg';
  }
  return type;
};

export function formatSizeUnits(bytes) {
  let isNegative = false;
  if (bytes < 0) {
    isNegative = true;
    bytes = Math.abs(bytes);
  }
  if (bytes >= 1073741824) {
    // 1 GB = 1073741824 bytes
    bytes = (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    // 1 MB = 1048576 bytes
    bytes = (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    // 1 KB = 1024 bytes
    bytes = (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    bytes += ' bytes';
  } else if (bytes === 1) {
    bytes += ' byte';
  } else {
    bytes = '0 bytes';
  }
  return isNegative ? '-' + bytes : bytes;
}

export const calculateFileSize = (files) => {
  const totalSize = files.reduce((total, data) => total + data.size, 0);
  return totalSize;
};

function splitArrayByFileSize(files) {
  let validSize = 0;
  let validFile = [];
  const validFileGroups = [];

  files.forEach((file) => {
    if (validSize + file.size > LIMIT_AZURE_FILE_SIZE) {
      // If adding the current file exceeds the max size, start a new File Groups
      validFileGroups.push(validFile);
      validFile = [file];
      validSize = file.size;
      return;
    }
    // Otherwise, add the file to the current File
    validFile.push(file);
    validSize += file.size;
  });

  // Add the last File Group if it's not empty
  if (validFile.length > 0) {
    validFileGroups.push(validFile);
  }

  return validFileGroups;
}

export const splitUploadFileSize = (files) => {
  let filesAvailable = files;
  const totalSize = calculateFileSize(files);
  if (totalSize > LIMIT_AZURE_FILE_SIZE) {
    filesAvailable = splitArrayByFileSize(files);
  }
  return filesAvailable;
};

export const getDimensionFile = (uri) =>
  new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        reject(error);
      }
    );
  });

export const getFileSize = async (filePath) => {
  if(!filePath) {
    return 0;
  }
  const fileStat = await RNFS.stat(filePath);
  return fileStat?.size || 0;
};
  