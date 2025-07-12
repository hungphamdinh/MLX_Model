/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import styled from 'styled-components/native';
import { Button, Card, Icon, Text } from '../Elements';
import { Colors, ImageResource } from '../Themes';
import { icons } from '../Resources/icon';

const SafeAreaView = styled.SafeAreaView`
  background-color: rgba(0, 0, 0, 0.5);
`;

const Backdrop = styled(AwareScrollView).attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
}))`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Wrapper = styled.View`
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  width: 100%;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #001434;
  height: 63px;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  margin-top: 15px;
`;

const Title = styled(Text)`
  flex: 1;
  color: white;
  margin-left: 12px;
  font-size: 15px;
`;

const Body = styled.View`
  background-color: ${Colors.bgMain};
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  padding: 12px 12px 20px 12px;
`;

const CloseButton = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background-color: white;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: -15px;
  right: -10px;
`;
const CloseIcon = styled.Image``;
const withModal = (WrappedComponent, title, containerStyle) => (props) => {
  const { visible, onClosePress, ...restProps } = props;

  return (
    <Modal visible={visible} transparent>
      <SafeAreaView />
      <Backdrop>
        <Wrapper>
          <HeaderWrapper>
            <Title text={title || props.title} preset="bold" />
            <CloseButton testID="closeButtonCheckBoxModal" onPress={onClosePress}>
              <CloseIcon source={icons.close} />
            </CloseButton>
          </HeaderWrapper>
          <Body style={containerStyle}>
            <WrappedComponent {...restProps} onClosePress={onClosePress} />
          </Body>
        </Wrapper>

        {/* <View style={styles.body}> */}
        {/*  <Button style={styles.button} onPress={onClosePress}> */}
        {/*    <Icon style={styles.closeImage} source={ImageResource.IC_Close} /> */}
        {/*  </Button> */}
        {/*  {title && <Text style={styles.title}>{title}</Text>} */}

        {/* </View> */}
      </Backdrop>
    </Modal>
  );
};

export default withModal;
