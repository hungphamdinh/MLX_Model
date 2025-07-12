import React, { useState } from 'react';
import { View, LayoutAnimation, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import ItemInspectionLinkage from '../../ItemApp/ItemInspectionLinkage';
import I18n from '../../../I18n';
import { Box, IconButton, Text } from '../../../Elements';
import Row from '../../Grid/Row';
import { Colors } from '../../../Themes';

const HeaderWrapper = styled(Row)`
  justify-content: space-between;
  margin-bottom: ${({ isExpand }) => (isExpand ? 0 : 10)}px;
`;

const ListInspectionLinkage = ({
  isSyncing,
  isClosed,
  data,
  onAddJob,
  onRemove,
  isShowCreate = true,
  onExecute,
  onViewReport,
  onRelease,
}) => {
  const [isExpand, setIsExpand] = useState(data.length > 0);

  const expand = () => {
    setIsExpand(!isExpand);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  return (
    <View>
      <HeaderWrapper>
        <Row center>
          <Text as="H2" text={I18n.t('INSPECTION')} preset="bold" />
          {isShowCreate && <IconButton onPress={onAddJob} name="add-circle" size={20} color={Colors.azure} />}
          {isSyncing && <ActivityIndicator size="small" color={Colors.azure} />}
        </Row>
        {data.length > 0 && (
          <IconButton
            onPress={expand}
            name={isExpand ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color={Colors.azure}
          />
        )}
      </HeaderWrapper>
      {isExpand && (
        <Box>
          {data.map((item) => (
            <ItemInspectionLinkage
              onRelease={() => onRelease(item)}
              key={item.id}
              isClosed={isClosed}
              onExecute={() => onExecute(item)}
              onViewReport={() => onViewReport(item)}
              onRemove={() => onRemove(item)}
              item={item}
            />
          ))}
        </Box>
      )}
    </View>
  );
};

export default ListInspectionLinkage;
