/**
 * Created by thienmd on 10/26/20
 */
import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Hud, IconButton, Text } from '@Elements';
import AppNavigationBar from './AppNavigationBar';
import DrawerMenu from './DrawerMenu';
import BottomActions from './BottomActions';
import { Colors } from '../../Themes';
import { icons } from '../../Resources/icon';
import LoaderContainer from './LoaderContainer';
import FormLoadingLoading from '../Lists/Loaders/FormLoadingLoading';
import { isGranted } from '../../Config/PermissionConfig';
import logService from '../../Services/LogService';
import ShadowView from '../../Elements/ShadowView';

const log = logService.extend('BaseLayout');

const AddButtonWrapper = styled(ShadowView)`
  background-color: #ffe136;
  width: 68px;
  height: 68px;
  border-radius: 34px;
  position: absolute;
  bottom: 15px;
  right: 15px;
  align-items: center;
  justify-content: center;
`;

const AddButtonLabel = styled(Text)`
  font-size: 10px;
  text-align: center;
  font-weight: bold;
  padding: 4px;
  color: #000;
`;

const AddButtonIcon = styled(Icon)`
  font-size: 45px;
  text-align: center;
`;

const BaseLayout = ({
  children,
  title,
  onBtAddPress,
  showAddButton,
  bottomButtons,
  containerStyle,
  labelButtonAdd,
  loading,
  displayPlaceholder,
  padding = false,
  addPermission,
  ...restProps
}) => {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [expandVisible, setExpandVisible] = React.useState(false);

  useEffect(() => {
    log.info(`${title} screen mounted`);

    return () => {
      log.info(`${title} screen unmounted`);
    };
  }, []);

  const onDrawerChange = (value) => {
    setDrawerVisible(value);
  };

  const navProps = {
    title,
    onDrawerChange,
    drawerVisible,
    leftIcon: drawerVisible && icons.closeBlack,
    ...restProps,
  };
  const splitButtons = _.size(bottomButtons) > 3 ? _.chunk(bottomButtons, 3) : bottomButtons ? [bottomButtons] : [];

  return (
    <View testID="base-layout" style={styles.container}>
      <AppNavigationBar {...navProps} />
      <DrawerMenu navProps={navProps} visible={drawerVisible} onDrawerChange={onDrawerChange} />
      <View style={[styles.body, { paddingHorizontal: padding ? 12 : 0 }, containerStyle]}>
        {displayPlaceholder && <LoaderContainer isLoading loadingComponent={<FormLoadingLoading />} />}
        {children}
      </View>

      {_.size(splitButtons) > 0 ? (
        <SafeAreaView style={{ backgroundColor: '#FFF', alignItems: 'center' }}>
          {splitButtons.map((item, index) => (
            <BottomActions
              testID="bottom-actions"
              key={index.toString()}
              index={index}
              buttons={item}
              expandVisible={expandVisible}
            />
          ))}
          {splitButtons.length > 1 && (
            <IconButton
              onPress={() => setExpandVisible(!expandVisible)}
              name={`chevron-${!expandVisible ? 'up' : 'down'}-outline`}
              size={20}
            />
          )}
        </SafeAreaView>
      ) : null}

      {onBtAddPress && showAddButton && isGranted(addPermission) && (
        <AddButtonWrapper
          testID="add-button"
          labelButtonAdd={labelButtonAdd}
          icon="add"
          transparent
          onPress={onBtAddPress}
        >
          {labelButtonAdd ? (
            <AddButtonLabel text={labelButtonAdd} />
          ) : (
            <AddButtonIcon name="add" size={45} color="#000" />
          )}
        </AddButtonWrapper>
      )}
      <Hud testID="loadingIndicator" loading={loading} />
    </View>
  );
};

export default BaseLayout;

BaseLayout.propTypes = {
  title: PropTypes.string,
  showAddButton: PropTypes.bool,
};

BaseLayout.defaultProps = {
  title: '',
  showAddButton: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  body: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
});
