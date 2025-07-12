import React, { Fragment } from 'react';
import { Rect } from 'react-content-loader/native';
import { View } from 'react-native';
import BaseContentLoader from './BaseContentLoader';
import { Metric } from '../../../Themes';

const getRightItemX = (width) => Metric.ScreenWidth - 30 - width;

const FormLoadingLoading = () => (
  <View>
    <BaseContentLoader>
      <Fragment>
        <Rect x="13" y={10} rx="20" ry="20" width={getRightItemX(15)} height="115" />
        <Rect x="13" y={150} rx="3" ry="3" width="136" height="20" />
        <Rect x="13" y={180} rx="3" ry="3" width="257" height="20" />
        <Rect x="13" y={250} rx="3" ry="3" width="157" height="20" />
        <Rect x="13" y={280} rx="3" ry="3" width="136" height="20" />
        <Rect x="13" y={310} rx="3" ry="3" width="257" height="20" />
        <Rect x="13" y={350} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={380} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={410} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={460} rx="3" ry="3" width={getRightItemX(60)} height="20" />
        <Rect x="13" y={490} rx="3" ry="3" width={getRightItemX(40)} height="20" />
        <Rect x="13" y={520} rx="3" ry="3" width={getRightItemX(40)} height="20" />
        <Rect x="13" y={550} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={580} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={650} rx="3" ry="3" width={getRightItemX(40)} height="20" />
        <Rect x="13" y={680} rx="3" ry="3" width={getRightItemX(15)} height="20" />
        <Rect x="13" y={720} rx="3" ry="3" width={getRightItemX(40)} height="20" />
      </Fragment>
    </BaseContentLoader>
  </View>
);

export default FormLoadingLoading;
