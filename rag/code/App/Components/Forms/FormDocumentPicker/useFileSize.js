import React, { Fragment, useEffect, useState } from 'react';
import i18n from '@I18n';
import _ from 'lodash';
import { modal } from '@Utils';
import { formatSizeUnits, checkImageByMimeType, getFileSize } from '@Utils/file';
import styled from 'styled-components/native';
import { Colors } from '@Themes';
import { Text } from '../../../Elements';
import Row from '../../Grid/Row';

const FileSizeWrapper = styled(Row)`
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const FileSizeText = styled(Text)`
  font-size: 12px;
  color: ${({ color }) => color};
`;

const useFileSize = ({ value, allSettings, documentsOfSameRecord = [], setFieldValue }) => {
  const [totalFileSize, setTotalFileSize] = useState(0);
  const { fileStorageSetting } = allSettings;
  const totalFileSizeOfEachRecord = fileStorageSetting?.totalFileSizeOfEachRecord;

  const remainingFileSize = totalFileSizeOfEachRecord - totalFileSize;


  const getFilesSize = async () => {
    const updatedValue = await Promise.all(
      value.map(async (item) => {
        if (!item.size && item) {
          const fetchedSize = await getFileSize(item.path || item.file);
          return { ...item, size: fetchedSize };
        }
        return { ...item, size: item.size || item.fileLength || 0 };
      })
    );

    setFieldValue(updatedValue);
  };

  const calculateFileSize = (files) => {
    if (!_.size(files)) {
      return 0;
    }
    const totalSize = files.reduce((total, data) => total + (data.fileLength || data.size), 0);
    return totalSize;
  };

  const validateLocalFileSize = (files) => {
    let maximumSizeUpload = 0;
    const localFile = files.filter((item) => item.path);
    const maximumImageSize = fileStorageSetting.maximumUploadOfImageFile;
    const maximumDocumentSize = fileStorageSetting.maximumOfEachDocumentFile;
    localFile.forEach((item) => {
      if (checkImageByMimeType(item.mimeType)) {
        if (item.size > maximumImageSize) {
          maximumSizeUpload = maximumImageSize;
          return;
        }
        return;
      }
      if (item.size > maximumDocumentSize) {
        maximumSizeUpload = maximumDocumentSize;
      }
    });
    return maximumSizeUpload;
  };

  useEffect(() => {
    getFilesSize()
  }, [_.size(value)])

  useEffect(() => {
    const totalOfRecord = [...documentsOfSameRecord, value].reduce((total, data) => total + calculateFileSize(data), 0);
    setTotalFileSize(totalOfRecord);
  }, [value, documentsOfSameRecord]);

  function checkTotalFileSize(files) {
    const totalSize = calculateFileSize(files);
    const remainingFile = totalFileSizeOfEachRecord;
    if (remainingFile - totalSize < 0) {
      modal.showError(i18n.t('MAX_FILE_SIZE_EXCEEDS', undefined, formatSizeUnits(totalFileSizeOfEachRecord)));
      return false;
    }

    const maximumSizeUpload = validateLocalFileSize(files);
    if (maximumSizeUpload > 0) {
      modal.showError(i18n.t('LOCAL_FILE_SIZE_EXCEED', undefined, formatSizeUnits(maximumSizeUpload)));
      return false;
    }
    return true;
  }

  const getFileSizeComponent = () => (
    <Fragment>
      <FileText label="REMAINING_FILE_SIZE" content={remainingFileSize} />
      <FileText label="TOTAL_FILE_SIZE_EACH_RECORD" content={totalFileSizeOfEachRecord} />
    </Fragment>
  );

  return {
    remainingFileSize,
    checkTotalFileSize,
    getFileSizeComponent,
  };
};

export default useFileSize;

const FileText = ({ label, content }) => (
  <FileSizeWrapper>
    <FileSizeText text={label} />
    <FileSizeText color={content < 0 ? 'red' : Colors.text} preset="bold" text={formatSizeUnits(content)} />
  </FileSizeWrapper>
);
