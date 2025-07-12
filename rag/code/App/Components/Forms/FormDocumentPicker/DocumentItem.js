import React from 'react';
import styled from 'styled-components/native';
import { Text, IconButton, ImageView } from '@Elements';
import moment from 'moment';
import LocaleConfig from '../../../Config/LocaleConfig';
import { checkImageByMimeType, formatSizeUnits, getDocumentIcon } from '../../../Utils/file';
import ShadowView from '../../../Elements/ShadowView';

const Wrapper = styled(ShadowView)`
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 60px;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  margin-top: 15px;
`;

const DocumentIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-right: 18px;
`;

const ImageThumbnail = styled(ImageView)`
  width: 30px;
  height: 30px;
  margin-right: 18px;
`;

const InfoWrapper = styled.View`
  flex: 1;
  justify-content: space-around;
`;

const FileName = styled(Text)`
  color: #001335;
  font-size: 12px;
`;

const Description = styled(Text)`
  font-size: 10px;
  color: #001335;
  margin-top: 8px;
`;

const ItemDocument = ({ item, onPress, onDelete, allowDelete }) => {
  const date = moment(item.creationTime).format(LocaleConfig.dateTimeFormat);
  const isImage = checkImageByMimeType(item.mimeType);
  const Icon = isImage ? ImageThumbnail : DocumentIcon;
  const source = isImage ? item : getDocumentIcon(item.mimeType);
  return (
    <Wrapper onPress={onPress}>
      <Icon source={source} />
      <InfoWrapper>
        <FileName numberOfLines={1} text={item.fileName} preset="medium" />
        <Description text={date} />
        <Description text={formatSizeUnits(item.fileLength || item.size)} />
      </InfoWrapper>
      {allowDelete && <IconButton name="close-circle" color="red" onPress={onDelete} />}
    </Wrapper>
  );
};

export default ItemDocument;
