import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { Button, IconButton } from '@Elements';

const ActionView = styled.View`
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  left: 0px;
  padding-top: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: row;
  justify-content: flex-end;
`;

const ImageBackground = styled.ImageBackground`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const ScrollWrapper = styled.ScrollView`
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
`;

const Wrapper = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  height: 120px;
  margin-bottom: 20px;
`;

const ThumbImage = ({ onRemoveImage, onEditImage, image }) => (
  <ImageBackground source={{ uri: image.uri }}>
    <ActionView>
      <IconButton onPress={onEditImage} name="create" size={25} color="white" />
      <IconButton onPress={onRemoveImage} name="close-circle" size={25} color="red" />
    </ActionView>
  </ImageBackground>
);

const ImageScrollView = ({ images, onRemoveImage, onEditImage }) => {
  if (_.size(images) === 0) {
    return null;
  }
  return (
    <Wrapper>
      <ScrollWrapper horizontal>
        {images.map((image) => (
          <ThumbImage
            key={image.id}
            image={image}
            onRemoveImage={() => onRemoveImage(image.id)}
            onEditImage={() => onEditImage(image)}
          />
        ))}
      </ScrollWrapper>
    </Wrapper>
  );
};

export default ImageScrollView;
