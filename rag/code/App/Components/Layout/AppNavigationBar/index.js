/**
 * Created by thienmd on 10/2/20
 */
/* @flow */
import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import { ImageView } from '@Elements';
import BellAlarm from './BellAlarm';
import { Button, Text } from '../../../Elements';
import { images } from '../../../Resources/image';
import useHome from '../../../Context/Home/Hooks/UseHome';
import { icons } from '../../../Resources/icon';
import useUser from '../../../Context/User/Hooks/UseUser';
import useNotification from '../../../Context/Notification/Hooks/UseNotification';
import TextButton from './TextButton';
import APIConfig from '../../../Config/apiConfig';

const Logo = styled.Image`
  width: 60px;
  height: 60px;
`;

const VerticalLine = styled.View`
  background-color: #d2d2d2;
  width: 1px;
  height: 100%;
  margin-horizontal: 10px;
`;

const ProjectLogoButton = styled.TouchableOpacity`
  box-shadow: 1px 1px 3px #919292;
`;

const ProjectLogo = styled(ImageView)`
  width: 60px;
  height: 60px;
  margin-left: 5px;
`;

const RightWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
`;

const LogoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.Image`
  width: ${({ size }) => size || 30}px;
  height: ${({ size }) => size || 30}px;
`;

const IconButton = ({ disabled, size = 20, icon, onPress }) => (
  <Button style={{ marginRight: -6 }} disabled={disabled} onPress={onPress} containerStyle={styles.rightButton}>
    <Icon size={size} source={icon} resizeMode="contain" tintColor={disabled ? 'gray' : 'black'} />
  </Button>
);

const AppNavigationBar = ({
  title,
  showLogo = false,
  onLeftPress,
  drawerVisible,
  onDrawerChange,
  showBell,
  helpModuleId,
  rightBtn,
  extraView,
  leftIcon,
  noShadow,
  customRightBtn,
}) => {
  const {
    home: { bottomModules },
  } = useHome();
  const {
    user: { tenant, accountUserId },
    getLinkedAccount,
  } = useUser();
  const {
    notification: { unreadCount },
  } = useNotification();
  const routeName = useRoute().name;
  // const bottomMenus =
  const showHamburger =
    _.includes(['home', 'inspectionHome', 'properties', 'teamJob', 'form', 'sync', 'jobs'], routeName) ||
    bottomModules.findIndex((item) => item.screen === routeName) > -1;
  // const showBack =
  const onBellPress = () => {
    onDrawerChange(false);
    NavigationService.navigate('notification');
  };

  const getTenantLogoUrl = () => `${APIConfig.apiCore}/TenantCustomization/GetTenantLogo?tenantId=${tenant.id}`;

  const onChangeTenant = () => {
    getLinkedAccount({
      userId: accountUserId,
    });
    NavigationService.navigateFromRoot('selectTenant');
  };

  const onHelpPress = () => {
    onDrawerChange(false);
    NavigationService.navigate('FAQ', {
      type: 'FAQ',
      id: helpModuleId,
    });
  };

  const onRightBtnPress = () => {
    onDrawerChange(false);
    if (rightBtn.onPress) {
      rightBtn.onPress();
    }
  };

  const btLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
      return;
    }

    if (showHamburger) {
      onDrawerChange(!drawerVisible);
      return;
    }
    NavigationService.goBack();
  };

  const renderLeft = () => (
    <Button style={styles.viewLeft} onPress={btLeftPress}>
      <Image source={leftIcon || (showHamburger ? icons.hamburger : icons.back)} />
    </Button>
  );

  const renderRight = () => {
    let RightBtn = IconButton;
    if (rightBtn && rightBtn.title) {
      RightBtn = TextButton;
    }
    return (
      <RightWrapper>
        {helpModuleId && <IconButton size={rightBtn.size} onPress={onHelpPress} icon={icons.help} />}
        {rightBtn && <RightBtn testID="base-layout-right-button" {...rightBtn} onPress={onRightBtnPress} />}
        {customRightBtn}
        {showBell && <BellAlarm unreadCount={unreadCount} onPress={onBellPress} />}
      </RightWrapper>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View style={[styles.cardWrapper]}>
        <View style={[styles.card, noShadow ? {} : styles.boxShadow]}>
          <View style={[styles.container]}>
            {renderLeft()}
            <View style={styles.centerView}>
              {!showLogo ? (
                <Text bold style={styles.title} text={title} />
              ) : (
                <LogoWrapper>
                  <Logo source={images.logo} resizeMode="contain" />
                  <VerticalLine />
                  {tenant?.id && (
                    <ProjectLogoButton onPress={onChangeTenant}>
                      <ProjectLogo source={getTenantLogoUrl()} resizeMode="contain" />
                    </ProjectLogoButton>
                  )}
                </LogoWrapper>
              )}
            </View>

            <View style={styles.spacing} />
            {/**/}
            {renderRight()}
          </View>
          {extraView}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppNavigationBar;

const propTypes = {
  showBell: PropTypes.bool,
  title: PropTypes.string,
  onLeftPress: PropTypes.func,
  helpModuleId: PropTypes.number,
  rightBtn: PropTypes.oneOfType([
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.number,
      titleOnly: PropTypes.bool,
      onPress: PropTypes.func,
    }),
    PropTypes.bool,
  ]),
};

export const AppNavigationBarTypes = PropTypes.shape(propTypes);

AppNavigationBar.propTypes = propTypes;

AppNavigationBar.defaultProps = {
  title: undefined,
  showBell: false,
  onLeftPress: null,
  rightBtn: undefined,
  navOptions: {},
  helpModuleId: undefined,
};

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  cardWrapper: {
    overflow: 'hidden',
    paddingBottom: 8,
  },
  card: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 66,
  },
  viewLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    width: 40,
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 40,
    paddingRight: 16,
  },
  disableText: {
    color: 'gray',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginHorizontal: 35,
  },
  centerView: {
    position: 'absolute',
    left: 40,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacing: {
    flex: 1,
  },
  rightButton: {
    marginRight: 10,
  },
});
