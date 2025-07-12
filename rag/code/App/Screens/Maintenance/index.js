import React from 'react';
import { View } from 'react-native';
import RNRestart from 'react-native-restart';
import styled from 'styled-components';
import { images } from '../../Resources/image';
import { Image, Text, Button } from '../../Elements';
import { Colors } from '../../Themes';
import I18n from '../../I18n';

const Wrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: -50px;
  background-color: ${Colors.azure};
`;

const ImageView = styled(Image)`
  width: 30px;
  height: 30px;
`;

const ImageWrapper = styled(View)`
  padding: 10px;
  background-color: white;
  border-radius: 100px;
`;

const Title = styled(Text)`
  font-size: 30px;
  color: white;
  text-align: center;
`;

const SubTitle = styled(Text)`
  margin-top: 20px;
  font-size: 15px;
  color: white;
  text-align: center;
`;

const ReloadButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 32,
    alignSelf: 'center',
  },
}))``;

const TitleWrapper = styled(View)`
  padding: 30px;
`;

const Maintenance = () => {
  const onPress = () => {
    RNRestart.Restart();
  };
  return (
    <Wrapper>
      <ImageWrapper>
        <ImageView tintColor={Colors.azure} source={images.maintenance} />
      </ImageWrapper>
      <TitleWrapper>
        <Title preset="bold" text={I18n.t('MAINTENANCE_PAGE_MESSAGE', "Sorry, we're down for maintenance")} />
        <SubTitle text={I18n.t('MAINTENANCE_PAGE_SUB_MESSAGE', "We'll be back shortly")} />
      </TitleWrapper>

      <ReloadButton title={I18n.t('BUTTON_RELOAD', 'Reload')} primary rounded onPress={onPress} />
    </Wrapper>
  );
};

export default Maintenance;
