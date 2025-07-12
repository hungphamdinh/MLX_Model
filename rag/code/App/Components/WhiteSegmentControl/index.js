import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { Colors } from '@Themes';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 50px;
  background-color: ${Colors.border};
  padding: 3px;
`;

const SegmentRNButton = styled.TouchableOpacity`
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  background-color: ${(props) => (props.isSelected ? 'white' : 'transparent')};
`;

const Title = styled(Text)`
  text-align: center;
`;

const BottomWrapper = styled(SafeAreaView)`
  background-color: white;
`;

const WhiteSegmentControl = ({ values, selectedIndex, onChange, style }) => {
  const handleChange = (index) => {
    onChange(index);
  };

  return (
    <>
      <Wrapper style={style}>
        {values.map((title, index) => {
          const isSelected = index === selectedIndex;
          return (
            <SegmentRNButton
              key={title}
              size={values.length}
              isSelected={isSelected}
              onPress={() => handleChange(index)}
            >
              <Title preset="medium" text={title} isSelected={isSelected} />
            </SegmentRNButton>
          );
        })}
      </Wrapper>
      <BottomWrapper />
    </>
  );
};

export default WhiteSegmentControl;
