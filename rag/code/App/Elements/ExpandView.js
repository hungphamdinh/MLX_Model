import React, { useState } from 'react';
import { View, LayoutAnimation } from 'react-native';
import styled from 'styled-components';
import I18n from '../I18n';
import { IconButton, Text } from '../Elements';
import { Colors } from '../Themes';
import Row from '../Components/Grid/Row';

const HeaderWrapper = styled(Row)`
  justify-content: space-between;
  margin-bottom: ${({ isExpand }) => (isExpand ? 0 : 10)}px;
`;

const ListInspectionLinkage = ({ children, title }) => {
  const [isExpand, setIsExpand] = useState(true);

  const expand = () => {
    setIsExpand(!isExpand);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  return (
    <View>
      <HeaderWrapper>
        <Row center>
          <Text as="H2" text={I18n.t(title)} preset="bold" />
        </Row>
        <IconButton
          onPress={expand}
          name={isExpand ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color={Colors.azure}
        />
      </HeaderWrapper>
      {isExpand && children}
    </View>
  );
};

export default ListInspectionLinkage;
