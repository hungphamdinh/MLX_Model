/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { Image, LayoutAnimation, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { Text } from '@Elements';
import { ImageResource, Metric } from '@Themes';
import Row from '../Grid/Row';
import FormControl, { useCommonFormController } from './FormControl';

const Star = ({ onPress, isSelected, id }) => {
  const image = isSelected ? ImageResource.ic_star_selected_form : ImageResource.ic_star_form;
  const marginRight = id === 5 ? 0 : 5;
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[styles.startContainer, { marginRight }]}>
      <Image style={styles.starIcon} source={image} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const Rating = ({ value, prefix, postfix, onChange }) => {
  const onPressStar = (id) => {
    onChange(id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <Row center>
      <Text style={styles.prefix}>{prefix}</Text>
      {_.range(1, 6).map((id) => (
        <Star key={id} id={id} isSelected={id <= value} onPress={() => onPressStar(id)} />
      ))}
      <Text style={styles.postfix}>{postfix}</Text>
    </Row>
  );
};

const FormRating = ({ label, name, required, containerStyle, translate, ...restProps }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  return (
    <FormControl label={label} error={error} translate={translate} required={required} style={containerStyle}>
      <Rating value={value} onChange={setFieldValue} {...restProps} />
    </FormControl>
  );
};
export default FormRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metric.Space,
  },
  startContainer: {
    marginRight: 10,
    marginVertical: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  postfix: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: Metric.space10,
    textAlign: 'right',
    flex: 1,
  },
  prefix: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: Metric.space10,
    flex: 1,
  },
});
