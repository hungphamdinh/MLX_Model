import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SyncItem, { SyncImageItem, SyncSignatureItem } from './index';
import { SyncState } from '../../../../Config/Constants';

const syncItemProps = {
  subject: 'Subject',
  workflow: { subject: 'Workflow Subject' },
  data: [
    {
      label: 'Label 1',
      value: 'Value 1',
    },
    {
      label: 'Label 2',
      value: 'Value 2',
    },
  ],
  inspection: {
    remoteId: '12345',
  },
};

describe('SyncItem', () => {
  test('renders correctly with synced state', () => {
    const { getByText, debug } = render(<SyncItem {...syncItemProps} syncState={SyncState.SYNCED} />);
    expect(getByText('INSPECTION: 12345 - Subject')).toBeDefined();
    debug();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCED')).toBeDefined();
    expect(getByText('Label 1: Value 1')).toBeDefined();
  });

  test('renders correctly with syncing state', () => {
    syncItemProps.syncState = SyncState.SYNCING;
    const { getByText } = render(<SyncItem {...syncItemProps} />);
    // debug();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCING')).toBeDefined();
  });

  test('renders correctly with not sync yet state', () => {
    syncItemProps.syncState = SyncState.NOT_SYNC;
    const { getByText } = render(<SyncItem {...syncItemProps} />);
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_NOT_YET')).toBeDefined();
  });

  test('calls onItemPress when pressed', () => {
    const onItemPress = jest.fn();
    const { getByTestId } = render(<SyncItem {...syncItemProps} onItemPress={onItemPress} />);
    fireEvent.press(getByTestId('sync-item'));
    expect(onItemPress).toHaveBeenCalled();
  });
});

describe('SyncImageItem', () => {
  test('renders correctly with synced state', () => {
    const { getByText } = render(
      <SyncImageItem {...syncItemProps} isSyncingImage={false} unSyncImagesCount={0} totalMediaSynced={0} />
    );
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCED')).toBeDefined();
    expect(getByText('INSPECTION_PHOTO_TO_BE_SYNC: 0')).toBeDefined();
    expect(getByText('INSPECTION_SYNCED_PHOTOS: 0')).toBeDefined();
  });

  test('renders correctly with syncing state', () => {
    const { getByText } = render(<SyncImageItem isSyncingImage unSyncImagesCount={1} totalMediaSynced={0} />);
    expect(getByText('INSPECTION_PHOTO_TO_BE_SYNC: 1')).toBeDefined();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCING')).toBeDefined();
  });

  test('renders correctly with not synced state', () => {
    const { getByText } = render(<SyncImageItem isSyncingImage={false} unSyncImagesCount={1} totalMediaSynced={0} />);
    expect(getByText('INSPECTION_PHOTO_TO_BE_SYNC: 1')).toBeDefined();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_NOT_YET')).toBeDefined();
  });
});

describe('SyncSignatureItem', () => {
  test('renders correctly with synced state', () => {
    const { getByText } = render(
      <SyncSignatureItem {...syncItemProps} isSyncingSignature={false} unSyncSignaturesCount={0} totalMediaSynced={0} />
    );
    expect(getByText('INSPECTION_SIGNATURE_TO_BE_SYNC: 0')).toBeDefined();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCED')).toBeDefined();
  });

  test('renders correctly with syncing state', () => {
    const { getByText, debug } = render(
      <SyncSignatureItem {...syncItemProps} isSyncingSignature unSyncSignaturesCount={1} totalMediaSynced={0} />
    );
    debug();

    expect(getByText('INSPECTION_SIGNATURE_TO_BE_SYNC: 1')).toBeDefined();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_SYNCING')).toBeDefined();
  });

  test('renders correctly with not synced state', () => {
    const { getByText } = render(
      <SyncSignatureItem {...syncItemProps} isSyncingSignature={false} unSyncSignaturesCount={1} totalMediaSynced={0} />
    );
    expect(getByText('INSPECTION_SIGNATURE_TO_BE_SYNC: 1')).toBeDefined();
    expect(getByText('INSPECTION_SYNC_STATUS: SYNC_STATUS_NOT_YET')).toBeDefined();
  });
});
