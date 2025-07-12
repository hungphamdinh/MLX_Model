/**
 * Created by thienmd on 10/9/20
 */
import React from 'react';
import { FlatList, StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Themes/Colors';
import { Metric } from '../Themes';

const List = ({
  data, id, ...restProps
}) => {
  React.useEffect(() => {
    console.log('on effect');
  }, []);
  return (
      <FlatList
        {...restProps}
        data={data}
        keyExtractor={item => `${item[id]}`}
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7}
        extraData={data}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.flatList}
      />
  );
};


export default List;

List.propTypes = {
  containerStyle: ViewPropTypes.style,
  id: PropTypes.string,
};

List.defaultProps = {
  containerStyle: undefined,
  id: 'id',
};

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    paddingBottom: 80,
    paddingTop: Metric.Space,
  },
  list: {
    flex: 1,
  },
  separator: {
    backgroundColor: Colors.border,
    flex: 1,
    height: 1,
  },
});
