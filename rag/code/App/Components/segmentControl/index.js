import React, { Fragment, useCallback, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity as RNButton } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '../../Elements';
import { Colors } from '../../Themes';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 46px;
  border-radius: 19px;
  padding: ${(props) => (props.isTransparent ? '0px' : '5px')};
  background-color: ${(props) => (props.isTransparent ? 'transparent' : '#EEEEEE')};
`;

const Segment = styled(TouchableOpacity).attrs((props) => ({
  containerStyle: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: props.isSelected ? '#648FCA' : 'transparent',
    marginHorizontal: props.isTransparent ? 3 : 1,
    paddingHorizontal: 5,
    minWidth: 50,
    borderWidth: props.isTransparent ? 1 : 0,
    borderColor: props.isSelected ? '#648FCA' : props.isTransparent ? Colors.border : 'transparent',
  },
}))``;

const SegmentRNButton = styled(RNButton)`
  flex: 1;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background-color: ${(props) => (props.isSelected ? '#648FCA' : 'transparent')};
  margin-horizontal: ${(props) => (props.isTransparent ? '3px' : '1px')};
  padding-horizontal: 5px;
  min-width: 50px;
  border-width: ${(props) => (props.isTransparent ? '1px' : '0px')};
  border-color: ${(props) => (props.isSelected ? '#648FCA' : props.isTransparent ? Colors.border : 'transparent')};
`;

const Title = styled(Text)`
  text-align: center;
  color: ${(props) => (props.isSelected ? 'white' : 'black')};
`;

const SegmentControl = ({
  values,
  selectedIndex,
  onChange,
  style,
  isMultiple = false,
  horizontal = true,
  overflow = false,
  isTransparent = false,
  scrollEnabled = true,
  dynamicScrolling = false,
}) => {
  const WrapperButton = overflow ? SegmentRNButton : Segment;
  const checkIfSelected = (index) => (selectedIndex || []).includes(index);

  const handleChange = (index) => {
    if (isMultiple) {
      const data = !checkIfSelected(index)
        ? [...(selectedIndex || []), index]
        : (selectedIndex || []).filter((pIndex) => pIndex !== index);
      onChange(data);
    } else {
      onChange(index);
    }
  };

  const Content = () => {
    const scrollViewRef = useRef(null);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const buttonLayouts = useRef([]);

    // Handle layout measurements of each button
    const handleLayout = useCallback(
      (index) => (event) => {
        const { x, width } = event.nativeEvent.layout;
        buttonLayouts.current[index] = { x, width };
      },
      []
    );

    // Handle tab change and scroll
    const handleChangeAndScroll = useCallback(
      (index) => {
        handleChange(index);
        if (buttonLayouts.current[index] && scrollViewWidth) {
          const { x, width } = buttonLayouts.current[index];
          const offset = x + width / 2 - scrollViewWidth / 2;

          // Ensure offset is within scrollable bounds
          scrollViewRef.current.scrollTo({
            x: offset >= 0 ? offset : 0,
            animated: true,
          });
        }
      },
      [handleChange, scrollViewWidth]
    );

    return (
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setScrollViewWidth(width);
        }}
      >
        {values.map((title, index) => {
          const isSelected = isMultiple ? (selectedIndex || []).includes(index) : index === selectedIndex;
          return (
            <WrapperButton
              key={title}
              testID="segment-control-segment"
              isSelected={isSelected}
              isTransparent={isTransparent}
              onLayout={handleLayout(index)}
              onPress={() => handleChangeAndScroll(index)}
            >
              <Title preset={isTransparent ? undefined : 'medium'} text={title} isSelected={isSelected} />
            </WrapperButton>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <Wrapper style={style} isTransparent={isTransparent}>
      {dynamicScrolling ? (
        <Fragment>
          <Ionicons name="chevron-back" size={20} color={Colors.azure} />
          {Content()}
          <Ionicons name="chevron-forward" size={20} color={Colors.azure} />
        </Fragment>
      ) : (
        <Fragment>{Content()}</Fragment>
      )}
    </Wrapper>
  );
};

export default SegmentControl;
