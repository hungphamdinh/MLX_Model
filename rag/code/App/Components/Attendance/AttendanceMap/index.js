import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import _ from 'lodash';
import { Box } from '@Elements';

import { icons } from '../../../Resources/icon';

const AttendanceMap = ({ geography, region }) => (
  <Box title="MAP">
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={region}
    >
      <Marker coordinate={region}>
        <View style={styles.location}>
          <Image source={icons.locationIcon} />
        </View>
      </Marker>
      <Marker
        coordinate={{
          latitude: _.get(geography, 'latitude', 0),
          longitude: _.get(geography, 'longitude', 0),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <View style={styles.building}>
          <Image source={icons.building} />
        </View>
      </Marker>
    </MapView>
  </Box>
);

export default AttendanceMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    height: 250,
    marginBottom: 15,
    borderRadius: 20,
  },
  building: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(84, 191, 2, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(75, 164, 208, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
