import React from 'react';
import styled from 'styled-components/native';
import DownIcon from 'react-native-vector-icons/Ionicons';
import { Dropdown, Text } from '@Elements';
import { Colors } from '../../../Themes';
// const Icon = styled()

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 50px;
  border-radius: 25px;
  border-width: 1px;
  border-color: ${Colors.border};
  margin-bottom: 10px;
`;

const Icon = styled.Image`
  width: 22px;
  height: 22px;
  margin-left: 18px;
`;

const Title = styled(Text)`
  color: ${(props) => (props.selected ? '#000' : '#757575')};
  flex: 1;
  margin-left: 10px;
`;

const DownWrapper = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.azure};
  margin-right: 7px;
`;

const TenantSelect = ({ icon, ...props }) => (
  <Dropdown
    {...props}
    showSearchBar
    fieldName="tenantName"
    valKey="tenantId"
    showCheckAll={false}
    showValue={false}
    renderCustomButtonView={(title, isSelected) => (
      <Wrapper>
        <Icon source={icon} resizeMode="contain" />
        <Title text={title} selected={isSelected} />
        <DownWrapper>
          <DownIcon name="chevron-down-outline" size={20} color="white" />
        </DownWrapper>
      </Wrapper>
    )}
  />
);

export default TenantSelect;
