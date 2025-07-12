import { Platform } from 'react-native';
import { Colors } from '@Themes';

export const foregroundColor = 'transparent';
export const backgroundColor = '#f4f4f4';
export const separatorColor = '#e8e9ec';

export const processedColor = '#a7e0a3';
export const processingColor = '#ffce5c';
export const failedColor = 'rgba(246, 126, 126,1)';

export const textDefaultColor = '#000';
export const textColor = '#000';
export const textLinkColor = '#343D4D';
export const textSecondaryColor = '#7a92a5';

export const textDayFontFamily = 'Gotham-Medium';
export const textMonthFontFamily = 'Gotham-Book';
export const textDayHeaderFontFamily = 'Gotham-Book';

export const textMonthFontWeight = '900';

export const textDayFontSize = 14;
export const textMonthFontSize = 14;
export const textDayHeaderFontSize = 13;

export const calendarBackground = foregroundColor;
export const textSectionTitleColor = '#b6c1cd';
export const selectedDayBackgroundColor = Colors.primary;
export const selectedDayTextColor = foregroundColor;
export const todayBackgroundColor = undefined;
export const todayTextColor = textLinkColor;
export const dayTextColor = textDefaultColor;
export const textDisabledColor = '#d9e1e8';
export const dotColor = textLinkColor;
export const selectedDotColor = foregroundColor;
export const arrowColor = textLinkColor;
export const monthTextColor = textDefaultColor;
export const agendaDayTextColor = '#7a92a5';
export const agendaDayNumColor = '#7a92a5';
export const agendaTodayColor = textLinkColor;
export const agendaKnobColor = Platform.OS === 'ios' ? '#f2F4f5' : '#4ac4f7';
