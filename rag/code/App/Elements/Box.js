import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import I18n from '@I18n';

import _ from 'lodash';

const Wrapper = styled.View``;

const Title = styled(Text)`
  font-size: ${props => (props.small ? '12px' : '14px')};
  text-transform: capitalize;
`;

const HeaderWrapper = styled.View`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const Mark = styled(Text)`
  color: red;
`;

const RoundBox = styled.View`
  background-color: white;
  border-radius: 20px;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 15px;
`;

const Box = ({ title, required, rightView, children, border = false, small = false }) => {
  let hideBox = !children;
  if (Array.isArray(children)) {
    hideBox = _.every(children, (item) => _.isEmpty(item));
  }

  const borderStyle = border
    ? {
        borderWidth: 1,
        borderColor: '#ddd',
      }
    : null;
  return (
    <Wrapper>
      {_.size(title) > 0 && (
        <HeaderWrapper>
          <Title preset={!small && 'bold'} small={small}>
            {I18n.t(title)} {required && <Mark>*</Mark>}
          </Title>
          {rightView}
        </HeaderWrapper>
      )}
      {!hideBox && <RoundBox style={borderStyle}>{children}</RoundBox>}
    </Wrapper>
  );
};

export default Box;
