/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Metric, Fonts, ImageResource } from '../Themes';
import LangText from './LangText';
import { Icon } from './index';

class HeadingText extends React.Component<Props> {
  render() {
    const { text, style, required } = this.props;
    return (
        <View style={styles.container}>
            <LangText
              fontFamily={Fonts.Bold}
              fontSize={Metric.text13}
              style={[styles.titleBlock, style]}
            >
                {text}
            </LangText>
            {
            required && (
            <Icon source={ImageResource.IC_Require} size={Metric.iconSize10} style={styles.requiredIcon} />
            )
          }

        </View>

    );
  }
}

HeadingText.propTypes = {
  text: PropTypes.string,
  required: PropTypes.bool,
};

HeadingText.defaultProps = {
  text: '',
  required: false,
};

export default HeadingText;
const styles = StyleSheet.create({
  titleBlock: {
    marginTop: Metric.Space,
    marginBottom: Metric.space10,
    marginLeft: Metric.Space,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requiredIcon: {
    marginLeft: 5,
  },
});
