import React from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Metric, Colors } from '../../../Themes';
import FilterCheckBox from './CheckBox';

const FilterWrapper = ({children, title, index}) => {
  const titleStyle = () => ({
      ...styles.title,
      marginTop: index === 0 ? 0 : Metric.space20
    });
  return (
      <View>
          {
        _.size(title) > 0 && (
        <Text style={titleStyle()} fontFamily={Fonts.Bold}>{I18n.t(title)} </Text>
        )
      }
          <View style={styles.divider} />

          <View style={{
      marginTop: Metric.space10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}
          >
              {children}
          </View>
      </View>
  );
};

const FilterSection = ({title, data, selectFilter, idx}) => (
    <FilterWrapper title={title} index={idx}>
        {data.map((item, index) =>
      (<FilterCheckBox
        onPress={() => selectFilter(index, item)}
        key={`${item.id}`}
        name={item.name}
        isCheck={item.isCheck}
        color={item.colorCode}
      />))}
    </FilterWrapper>
);

export default FilterSection;


const styles = StyleSheet.create({
  title: {
    color: 'black',
    marginTop: Metric.space20,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.semiGray,
    marginTop: 5
  },
});
