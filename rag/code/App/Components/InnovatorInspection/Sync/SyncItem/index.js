import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import I18n from '@I18n';
import SyncStatus from '../SyncStatus';
import { SyncState } from '@Config/Constants';
import { Wrapper } from '../../../ItemApp/ItemCommon';

const SyncValueText = styled(Text)`
  margin-top: 10px;
`;

const Title = styled(Text)`
  flex: 1;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
`;

function SyncValue({ label, value }) {
  const labelDisplay = I18n.t(label);
  const text = `${labelDisplay}: ${value}`;
  return <SyncValueText text={text} />;
}

function SyncItem({ subject, workflow, data = [], inspection, syncState, onItemPress }) {
  const inspectionText = I18n.t('INSPECTION');
  const subjectDisplay = subject || workflow?.subject;
  const title = `${inspectionText}: ${inspection?.remoteId} - ${subjectDisplay}`;

  switch (syncState) {
    case SyncState.SYNCING:
      syncText = 'SYNC_STATUS_SYNCING';
      break;
    case SyncState.SYNCED:
      syncText = 'SYNC_STATUS_SYNCED';
      break;
    default:
      syncText = 'SYNC_STATUS_NOT_YET';
      break;
  }

  const syncStatus = I18n.t(syncText);
  return (
    <Wrapper onPress={onItemPress} testID="sync-item">
      <HeaderWrapper>
        <Title preset="bold">{title}</Title>
        <SyncStatus state={syncState} />
      </HeaderWrapper>
      <SyncValue label="INSPECTION_SYNC_STATUS" value={syncStatus} />
      {data.map((item) => (
        <SyncValue key={item.label} label={item.label} value={item.value} />
      ))}
    </Wrapper>
  );
}

export const SyncImageItem = (props) => {
  const { isSyncingImage } = props;
  let syncState = isSyncingImage ? SyncState.SYNCING : SyncState.NOT_SYNC;
  if (props.unSyncImagesCount === props.totalMediaSynced) {
    syncState = SyncState.SYNCED;
  }
  const data = [
    {
      label: I18n.t('INSPECTION_PHOTO_TO_BE_SYNC'),
      value: props.unSyncImagesCount,
    },
    {
      label: I18n.t('INSPECTION_SYNCED_PHOTOS'),
      value: `${props.totalMediaSynced || 0}`,
    },
  ];
  return <SyncItem {...props} data={data} syncState={syncState} />;
};

export const SyncSignatureItem = (props) => {
  const { isSyncingSignature } = props;
  let syncState = isSyncingSignature ? SyncState.SYNCING : SyncState.NOT_SYNC;
  if (props.unSyncSignaturesCount === props.totalMediaSynced) {
    syncState = SyncState.SYNCED;
  }
  const data = [
    {
      label: I18n.t('INSPECTION_SIGNATURE_TO_BE_SYNC'),
      value: props.unSyncSignaturesCount,
    },
    {
      label: I18n.t('INSPECTION_SYNCED_SIGNATURES'),
      value: `${props.totalMediaSynced || 0}`,
    },
  ];
  return <SyncItem {...props} data={data} syncState={syncState} />;
};

export default SyncItem;
