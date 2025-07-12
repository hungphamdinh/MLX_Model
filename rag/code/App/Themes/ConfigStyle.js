import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 780;

const scale = size => width / guidelineBaseWidth * size - 1;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const configInputMoney = (decimalSeparator, currency) => ({
  precision: 0,
  separator: ' ',
  delimiter: decimalSeparator,
  unit: `${currency} `,
});

export default {
  scale, verticalScale, moderateScale, configInputMoney,
};
