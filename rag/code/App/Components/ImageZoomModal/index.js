import React, { useState, useEffect } from 'react';
import { Dimensions, Modal, View, SafeAreaView } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';
import ImageView from '../../Elements/ImageView';
import { icons } from '../../Resources/icon';

const { width, height } = Dimensions.get('window');

const Wrapper = styled(View)`
  background-color: black;
`;

const CloseButton = styled.TouchableOpacity`
  width: 40px;
  padding: 20px;
  position: absolute;
  z-index: 1;
`;

const Image = styled(ImageView)`
  width: ${width}px;
  height: ${height}px;
`;

const CloseIcon = styled.Image`
  tint-color: white;
`;

const ImageZoomModal = ({ onClose, visible, index, images, testID }) => {
  const [scale, setScale] = useState(1);
  const onSetScale = (event) => {
    setScale(event.scale);
  };

  useEffect(() => {
    if (visible) {
      setScale(1);
    }
  }, [visible]);

  const renderItem = ({ item }) => (
    <ImageZoom
      cropWidth={width}
      cropHeight={height}
      imageWidth={width}
      imageHeight={height}
      onMove={(event) => {
        if (event.type === 'onPanResponderRelease') {
          onSetScale(event);
        }
      }}
    >
      <Image resizeMode="contain" source={item} />
    </ImageZoom>
  );

  return (
    <Modal testID={testID} visible={visible}>
      <SafeAreaView style={{ backgroundColor: 'black' }} />
      <Wrapper>
        <CloseButton testID="button-close-zoom-modal" onPress={onClose}>
          <CloseIcon source={icons.closeBlack} />
        </CloseButton>
        <Carousel
          firstItem={index}
          initialNumToRender={100}
          loop
          scrollEnabled={scale <= 1.1}
          data={images}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
        />
      </Wrapper>
    </Modal>
  );
};

export default ImageZoomModal;
