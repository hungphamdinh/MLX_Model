/* @flow */

import React from 'react';
import { Image as NativeImage } from 'react-native';
import _ from 'lodash';

import CacheImage from './Image';
import { ImageResource } from '../Themes';
import { getBearerToken } from '../Services/FileService';

const ImageView = ({ source, cache, ...restProps }) => {
  let uri = source;
  const fileUrl = _.get(source, 'fileUrl') || _.get(source, 'urls');
  const path = _.get(source, 'path');

  if (fileUrl) {
    uri = fileUrl;
  }
  if (_.size(path) > 10) {
    uri = path;
  }
  let imgSource = { uri };

  if (fileUrl) {
    imgSource = {
      ...imgSource,
      headers: getBearerToken(),
    };
  }
  if (_.size(uri) === 0) {
    imgSource = ImageResource.IMG_EmptyImage;
  }

  const Image = cache === 'none' ? NativeImage : CacheImage;

  return <Image source={imgSource} {...restProps} />;
};

export default React.memo(ImageView);
