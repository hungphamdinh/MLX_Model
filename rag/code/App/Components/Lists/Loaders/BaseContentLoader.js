import ContentLoader from 'react-content-loader/native';
import React from 'react';
import { Metric } from '../../../Themes';

const BaseContentLoader = ({ children }) => (
    <ContentLoader
      speed={2}
      width={Metric.ScreenWidth}
      height={Metric.ScreenHeight}
      viewBox={`0 0 ${Metric.ScreenWidth} ${Metric.ScreenHeight}`}
      backgroundColor="#ddd"
      foregroundColor="#F9F9F9"
    >
        {children}
    </ContentLoader>
);

export default BaseContentLoader;
