/**
 * Created by thienmd on 10/27/20
 */

import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { Fragment } from 'react';
import { Button } from '@Elements';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isGranted } from '../../Config/PermissionConfig';
import { Metric } from '../../Themes';

/** *
 * buttons = [
 * {
 *   title: "button 1",
 *   type: 'primary',
 *   permission: ''
 *   onPress: () => {}
 * }
 * ]
 *
 */

const BottomActions = ({ buttons, expandVisible = true, index }) => {
  const firstSection = index === 0;
  const paddingTop = expandVisible ? 15 : 10;
  const grantedButtons = _.filter(buttons, (button) => isGranted(button.permission));
  if (grantedButtons.length === 0) {
    return null;
  }
  return (
    <SafeAreaView testID="bottom-actions" style={{ backgroundColor: '#FFF' }}>
      <View style={[styles.container, { paddingTop }]}>
        {grantedButtons.map(({ type, title, icon, onPress, ...buttonProps }, idx) => (
          <Fragment key={title}>
            {expandVisible || firstSection ? (
              <Button
                key={title}
                {...{ [type]: true }}
                title={title}
                onPress={onPress}
                icon={icon}
                rounded
                testID={`button-${idx}`}
                containerStyle={styles.button}
                {...buttonProps}
              />
            ) : null}
          </Fragment>
        ))}
      </View>
    </SafeAreaView>
  );
};


export default BottomActions;

BottomActions.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      onPress: PropTypes.func,
    })
  ),
};

BottomActions.defaultProps = {
  buttons: [],
};

const styles = StyleSheet.create({
  button: {
    marginRight: 7,
    marginBottom: 0,
    minWidth: Metric.scale(100),
  },
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    justifyContent: 'center',
  },
});
