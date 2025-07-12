import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const HomeLoading = () => (
    <View style={{ marginLeft: 16 }}>
        <ContentLoader
          speed={2}
          width={600}
          height={1200}
          viewBox="0 0 600 1200"
          backgroundColor="#ddd"
          foregroundColor="#F9F9F9"
        >
            <Rect x="4" y="18" rx="5" ry="5" width="140" height="30" />
            <Rect x="-2" y="58" rx="5" ry="5" width="225" height="208" />
            <Rect x="247" y="56" rx="5" ry="5" width="225" height="208" />
            <Rect x="3" y="370" rx="5" ry="5" width="140" height="30" />
            <Rect x="-3" y="410" rx="5" ry="5" width="225" height="208" />
            <Rect x="246" y="408" rx="5" ry="5" width="225" height="208" />
            <Rect x="-1" y="285" rx="14" ry="14" width="223" height="27" />
            <Rect x="251" y="285" rx="14" ry="14" width="223" height="27" />
            <Rect x="4" y="704" rx="14" ry="14" width="223" height="27" />
            <Rect x="245" y="703" rx="14" ry="14" width="223" height="27" />
            <Rect x="6" y="774" rx="5" ry="5" width="78" height="17" />
            <Rect x="3" y="706" rx="5" ry="5" width="126" height="146" />
            <Rect x="7" y="910" rx="14" ry="14" width="125" height="15" />
            <Rect x="159" y="824" rx="5" ry="5" width="78" height="17" />
        </ContentLoader>
    </View>
);

export default HomeLoading;
