import React, { useState, useCallback } from 'react';
import { ScrollView, Image, Modal, SafeAreaView, Animated } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../../../Elements';
import apiConfig from '../../../Config/apiConfig';
import { icons } from '../../../Resources/icon';
import { Colors } from '../../../Themes';

const ItemContainer = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: #fff;
  margin: 5px 10px;
  padding: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const GroupContainer = styled(ItemContainer)`
  margin-top: ${(props) => (props.isFirst ? '20px' : '10px')};
  background-color: #f5f5f5;
`;

const ItemContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GroupHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AmenityIcon = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const StyledText = styled(Text)`
  flex: 1;
  color: #333;
`;

const GroupName = styled(Text)`
  color: #333;
`;

const Wrapper = styled.View`
  flex: 1;
`;

const HeaderWrapper = styled.View`
  height: 50px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-direction: row;
  background-color: white;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled(Text)`
  position: absolute;
  left: 60px;
  right: 60px;
  text-align: center;
  text-transform: uppercase;
`;

const CloseButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.View`
  flex: 1;
  background-color: ${Colors.bgMain};
  padding-top: 10px;
`;

const AmenityItem = ({ item, onPress }) => (
  <ItemContainer onPress={() => onPress(item)}>
    <ItemContent>
      <AmenityIcon resizeMode="cover" source={{ uri: apiConfig.apiBooking + item.iconPath }} />
      <StyledText text={item.amenityName} />
    </ItemContent>
  </ItemContainer>
);

const GroupedAmenities = ({ group, items, isFirst, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [isExpanded]);

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <GroupContainer isFirst={isFirst} onPress={toggleExpand}>
      <GroupHeader>
        <GroupName text={group.name} preset="bold" />
        <Animated.Text style={{ transform: [{ rotate: rotateIcon }] }}>▼</Animated.Text>
      </GroupHeader>

      {isExpanded && (
        <Animated.View style={{ opacity: animation }}>
          {items.map((item) => (
            <AmenityItem key={item.amenityId} item={item} onPress={onSelect} />
          ))}
        </Animated.View>
      )}
    </GroupContainer>
  );
};

const SelectAmenityModal = ({ visible, data, onClose, onSelect }) => {
  // Group amenities by amenityGroup
  const groupedData = data?.reduce(
    (acc, item) => {
      if (item.amenityGroup) {
        const groupId = item.amenityGroup.bookingAmenityGroupId;
        if (!acc.groups[groupId]) {
          acc.groups[groupId] = {
            group: item.amenityGroup,
            items: [],
          };
        }
        acc.groups[groupId].items.push(item);
      } else {
        acc.ungrouped.push(item);
      }
      return acc;
    },
    { groups: {}, ungrouped: [] }
  );

  return (
    <Modal
      style={{
        flex: 1,
        margin: 0,
      }}
      animationType="slide"
      onSwipeComplete={onClose}
      visible={visible}
    >
      <Wrapper>
        <SafeAreaView />
        <HeaderWrapper>
          <CloseButton testID="modal-close-button" onPress={onClose}>
            <Image source={icons.closeBlack} />
          </CloseButton>
          <HeaderTitle preset="medium" text="BK_MODAL_CHOOSE_HEADER" />
        </HeaderWrapper>
        <ContentWrapper>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {groupedData &&
              Object.entries(groupedData.groups).map(([groupId, { group, items }], index) => (
                <GroupedAmenities key={groupId} group={group} items={items} isFirst={index === 0} onSelect={onSelect} />
              ))}

            {groupedData?.ungrouped.map((item) => (
              <AmenityItem key={item.amenityId} item={item} onPress={onSelect} />
            ))}
          </ScrollView>
        </ContentWrapper>
      </Wrapper>
    </Modal>
  );
};

export default SelectAmenityModal;
