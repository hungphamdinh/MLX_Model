import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import apiConfig from '../../../Config/apiConfig';
import { Colors } from '../../../Themes';
import { Text } from '../../../Elements';

const styles = {
  amenityContainer: {
    height: 40,
    paddingLeft: 5,
    paddingRight: 20,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFF',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  amenityIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
};

const AmenityButton = ({ amenity, disabled, onPress }) => {
  if (!amenity) {
    return null;
  }
  return (
    <TouchableOpacity style={styles.amenityContainer} onPress={onPress} disabled={disabled}>
      <Image style={styles.amenityIcon} resizeMode="cover" source={{ uri: apiConfig.apiBooking + amenity.iconPath }} />
      <Text style={{ flex: 1 }} numberOfLines={1}>
        {amenity.amenityName}
      </Text>
      <Icon name="caret-down" size={20} color={disabled ? 'gray' : '#648FCA'} />
    </TouchableOpacity>
  );
};

export default AmenityButton;
