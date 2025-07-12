/* @flow */

import React from 'react';
import {
  View,
} from 'react-native';
import {
  Fonts, Metric, ImageResource,
} from '../../../Themes';
import {
  Text, Icon,
} from '../../../Elements';


import I18n from '../../../I18n';


const Section = ({
  title, children, isRequire = true, style,
}) => (
    <View>
        <View style={[style, {
    marginTop: Metric.Space,
    marginBottom: Metric.space10,
    marginRight: Metric.space5,
    flexDirection: 'row',
  }]}
        >
            <Text
              fontFamily={Fonts.Bold}
              fontSize={Metric.text13}
            >
                {I18n.t(title)}
            </Text>
            {isRequire && <Icon source={ImageResource.IC_Require} size={Metric.iconSize10} style={{ marginLeft: Metric.space5 }} />}
        </View>
        {children}
    </View>

);

export default Section;
