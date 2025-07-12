import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import I18n from '@I18n';
import _ from 'lodash';

import Text from './Text';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

const Expand = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const Linkages = ({ onPress, linkages, text, style, maxVisibleItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowExpand = maxVisibleItems && linkages.length > maxVisibleItems;

  const visibleLinkages = shouldShowExpand && !isExpanded
    ? _.take(linkages, maxVisibleItems)
    : linkages;

  return (
    <View style={style}>
      <View>
        {_.map(visibleLinkages, (linkage) => (
          <TouchableOpacity
            key={`${linkage.id}`}
            disabled={!onPress}
            onPress={() => onPress && onPress(linkage)}
          >
            <Text
              style={{ color: onPress ? 'blue' : 'black' }}
              numberOfLines={1}
              text={`${I18n.t(text)} #${linkage.id}`}
            />
          </TouchableOpacity>
        ))}
      </View>

      {shouldShowExpand && (
        <Expand onPress={handleToggleExpand}>
          <Text style={{color: 'gray'}} text={isExpanded ? 'SHOW_LESS' : 'SHOW_MORE'}/>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="gray"
          />
        </Expand>
      )}
    </View>
  );
};


export default Linkages;