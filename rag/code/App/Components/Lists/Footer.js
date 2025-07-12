import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors, Metric } from '../../Themes';

const Footer = ({ loadMore }) => {
  const space = Metric.isIOS ? Metric.space60 + Metric.Space : Metric.space60;
  if (loadMore) {
    return (
        <View style={{ height: space, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.colorMain} />
        </View>
    );
  }
  return <View style={{ height: space }} />;
};

export default React.memo(Footer);
