/* @flow */

import { Alert } from 'react-native';

export default alert = (title: string, message: string, onOk: Function, textOk: string, textCancel: string, onCancel = () => {},) => Alert.alert(
  title || '',
  message || '',
  [
    {
      text: textCancel || '',
      onPress: onCancel,
      style: 'cancel',
    },
    { text: textOk || '', onPress: onOk },
  ],
  { cancelable: false },
);
