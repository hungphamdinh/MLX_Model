import * as React from 'react';
import { MentionInput } from 'react-native-controlled-mentions';
import { Platform, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { Colors } from '../../Themes';
import { useCommonFormController } from './FormControl';

const Wrapper = styled.View`
  margin-horizontal: 16px;
  border-width: 1px;
  border-radius: 20px;
  min-height: 40px;
  border-color: ${Colors.border};
  background-color: white;
`;

const RightIconWrapper = styled.View`
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

export const AppInput = React.forwardRef(
  ({ name, placeholder, style, containerStyle, multiline, rightButton, onChange, renderMentionSuggestions }) => {
    const { value, setFieldValue } = useCommonFormController(name);
    const paddingVertical = Platform.OS === 'ios' ? 12 : 0;
    return (
      <SafeAreaView>
        <Wrapper>
          <MentionInput
            autoFocus
            value={value}
            // onChange={onChangeText}
            onChange={(text) => {
              if (onChange) {
                onChange(text);
              }
              if (onChange) {
                setFieldValue(text);
              }
            }}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions: renderMentionSuggestions,
              },
              {
                pattern:
                  /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+\]~#?&/=])*/gi,
                textStyle: { color: '#5079C1' },
              },
            ]}
            style={[styles.mentionText, { paddingVertical }, style]}
            containerStyle={[styles.mentionContainer, containerStyle]}
            placeholder={I18n.t(placeholder)}
            multiline={multiline}
          />
          {rightButton && <RightIconWrapper>{rightButton}</RightIconWrapper>}
        </Wrapper>
      </SafeAreaView>
    );
  }
);

export default AppInput;

const styles = {
  mentionContainer: {},
  mentionText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
    fontWeight: 'normal',
    paddingLeft: 12,
    paddingRight: 50,
  },
};
