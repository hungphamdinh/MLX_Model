/**
 * Created by thienmd on 11/13/20
 */
import React from 'react';
import { View } from 'react-native';
import I18n from '@I18n';
import { ImageResource } from '@Themes';
import { Image, Text } from '@Elements';


const EmptyListComponent = ({emptyMsg}) => (
    <View style={styles.container}>
        <Text style={styles.text}>{I18n.t(emptyMsg || 'AD_IS_EMPTY_TEXT')}</Text>
        <Image
          source={ImageResource.IMG_EmptyList}
          style={styles.image}
          resizeMode="contain"
        />
    </View>
);

export default React.memo(EmptyListComponent);

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    marginTop: 35,
  },
  image: {
    height: 70,
    width: 70,
    marginTop: 40,
  },
};
