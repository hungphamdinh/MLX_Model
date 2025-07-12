import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Text } from '@Elements';
import NavigationService from '@NavigationService';

import TopLeftButton from '../TopLeftButton';
import TopRightButton from '../TopRightButton';
import AwareScrollView from '../../Layout/AwareScrollView';
import { images } from '../../../Resources/image';

const Wrapper = styled.SafeAreaView`
  flex: 1;
`;

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  font-size: 30px;
  margin-top: 50px;
`;

const Subtitle = styled(Text)`
  color: black;
  font-size: 18px;
  margin-top: 26px;
  line-height: 24px;
`;

const Logo = styled.Image`
  width: 110px;
  height: 110px;
  margin-top: 15px;
`;

const LogoContainer = styled.SafeAreaView`
  align-items: center;
  background-color: #f4f4f4;
  margin-top: 30px;
`;

const Wallpaper = styled.ImageBackground`
  width: 100%;
  height: 300px;
  justify-content: center;
  padding-horizontal: 40px;
`;

const AuthLayout = ({
  containerStyle,
  showLeftButton,
  showLeftButtonIcon,
  leftButtonTitle,
  onLeftButtonPress,
  renderLeftButton,
  children,
  title,
  description,
  isShowLogo,
  showRightButton,
  onRightButtonPress,
}) => (
  <Wrapper style={containerStyle}>
    {showLeftButton &&
      (renderLeftButton || (
        <TopLeftButton
          leftTitle={leftButtonTitle}
          onLeftPress={() => (onLeftButtonPress ? onLeftButtonPress() : NavigationService.goBack())}
          showLeftIcon={showLeftButtonIcon}
        />
      ))}
    {showRightButton && (
      <TopRightButton onPress={() => (onRightButtonPress ? onRightButtonPress() : NavigationService.goBack())} />
    )}

    <AwareScrollView>
      {isShowLogo && (
        <LogoContainer>
          <Logo source={images.logo} resizeMode="contain" />
        </LogoContainer>
      )}
      {title || description ? (
        <Wallpaper source={images.loginBackground}>
          <Title text={title} />
          <Subtitle text={description} />
        </Wallpaper>
      ) : null}

      {children}
    </AwareScrollView>
  </Wrapper>
);

export default AuthLayout;

AuthLayout.propTypes = {
  isShowLogo: PropTypes.bool,
  showLeftButton: PropTypes.bool,
  showLeftButtonIcon: PropTypes.bool,
  leftButtonTitle: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

AuthLayout.defaultProps = {
  title: undefined,
  description: undefined,
  showLeftButton: true,
  isShowLogo: true,
  showLeftButtonIcon: true,
  leftButtonTitle: 'AD_COMMON_BACK',
};
