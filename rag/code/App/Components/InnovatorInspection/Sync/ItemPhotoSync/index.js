import React from 'react';
import styled from 'styled-components';
import { ImageView, Text } from '@Elements';
import { SyncState } from '@Config/Constants';
import Row from '../../../Grid/Row';
import SyncStatus from '../SyncStatus';

const Wrapper = styled.View`
  background-color: white;
  margin-bottom: 20px;
  margin-horizontal: 20px;
  padding-right: 10px;
  border-radius: 10px;
`;

const Photo = styled(ImageView)`
  width: 80px;
  height: 80px;
  border-radius: 10px;
`;

const NameWrapper = styled(Text)`
  width: 200px;
  margin-left: 15px;
`;

const ItemPhotoSync = ({ item, title, syncingMedias }) => {
  const syncedGuids = syncingMedias.map((syncImage) => syncImage.guid);
  const isSyncing = syncedGuids.includes(item.guid);
  const syncState = item.synced ? SyncState.SYNCED : isSyncing ? SyncState.SYNCING : SyncState.NOT_SYNC;

  return (
    <Wrapper>
      <Row center style={{ justifyContent: 'space-between' }}>
        <Row center>
          <Photo cache="none" source={item} />
          <NameWrapper numberOfLines={2} text={title} />
        </Row>
        <SyncStatus state={syncState} />
      </Row>
    </Wrapper>
  );
};
export default ItemPhotoSync;
