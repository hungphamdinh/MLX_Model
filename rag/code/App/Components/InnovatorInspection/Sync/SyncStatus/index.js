import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SyncState } from '../../../../Config/Constants';

const SyncStatus = ({ state }) => {
  let iconName;
  const iconColor = '#1daaf4';

  switch (state) {
    case SyncState.NOT_SYNC:
      iconName = 'cloud-offline';
      break;
    case SyncState.SYNCING:
      iconName = 'cloud-upload';
      break;
    default:
      iconName = 'cloud-done';
      break;
  }

  return (
    <View>
      <Ionicons size={20} name={iconName} color="black" />
    </View>
  );
};

export default SyncStatus;
