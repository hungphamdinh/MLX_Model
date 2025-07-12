import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ImageView } from '@Elements';

import styled from 'styled-components/native';
import ImageZoomModal from '../Components/ImageZoomModal';

const SignatureImage = styled(ImageView)`
  width: 100%;
  height: 120px;
`;

const Signature = ({ values }) => {
  const [zoomModalVisible, setZoomModalVisible] = useState(false);

  const onImagePress = () => {
    setZoomModalVisible(true);
  };

  const onZoomModalClose = () => {
    setZoomModalVisible(false);
  };

  return (
    <>
      {values && (
        <TouchableOpacity onPress={onImagePress}>
          <SignatureImage source={values} resizeMode="contain" />
        </TouchableOpacity>
      )}
      <ImageZoomModal images={[values]} visible={zoomModalVisible} index={0} onClose={onZoomModalClose} />
    </>
  );
};

export default Signature;
