import _ from 'lodash';
import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '@Elements';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Color = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: ${(props) => props.color};
`;

const Title = styled(Text)`
  margin-left: 16px;
`;

const NextWrapper = styled.View`
  width: 18px;
  height: 18px;
  background-color: #648fca;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const StatusWrapper = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const SubStatus = styled.View`
  flex-direction: row;
  flex: 1;
  margin-left: 18px;
`;

export const NextIcon = () => (
  <NextWrapper>
    <Icon size={12} color="white" name="chevron-forward" />
  </NextWrapper>
);

const StatusView = ({ status, subStatus, hideNextIcon, subComponent }) => {
  const colorName = _.get(status, 'name', 'New');
  const colorCode = _.get(status, 'colorCode', 'blue');
  const subColorName = _.get(subStatus, 'name', 'New');
  const subColorCode = _.get(subStatus, 'colorCode', 'blue');
  return (
    <Wrapper>
      <StatusWrapper>
        <StatusWrapper>
          <Color color={colorCode} />
          <Title preset="medium" text={colorName} />
        </StatusWrapper>

        {subStatus && (
          <SubStatus style={{ justifyContent: hideNextIcon ? 'flex-end' : 'flex-start' }}>
            <Color color={subColorCode} />
            <Title preset="medium" text={subColorName} />
          </SubStatus>
        )}
      </StatusWrapper>
      {!hideNextIcon && !subComponent && <NextIcon />}
      {subComponent}
    </Wrapper>
  );
};

export default StatusView;
