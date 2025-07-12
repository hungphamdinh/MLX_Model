// SlotView.js
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import _ from 'lodash';
import { Colors } from '@Themes';
import { Text } from '../../../Elements';
import FormControl, { useCommonFormController } from '../../Forms/FormControl';

// Styled components
const Container = styled.View`
  background-color: white;
`;

const TimeSlotBox = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const TimeSlot = styled.TouchableOpacity`
  width: 85px;
  height: 22px;
  border-radius: 5px;
  background-color: ${(props) => props.backgroundColor};
  margin-vertical: 5px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const UnavailableSlot = styled.View`
  width: 85px;
  height: 22px;
  border-radius: 5px;
  background-color: #e9ebee;
  margin-vertical: 5px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const SlotFlag = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${Colors.red};
`;

const SlotText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
`;

const EmptySlotMessage = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

const SlotView = ({ slots = [], onSlotsChange, numberSlot = 1 }) => {
  // Calculate total selected slots
  const totalSelected = useMemo(() => slots.filter((item) => item.isCheck).length, [slots]);

  // Show flag when slots are partially selected
  const showFlag = useMemo(() => totalSelected > 0 && totalSelected < numberSlot, [totalSelected, numberSlot]);

  // Calculate slot background color based on selection state
  const getSlotColor = useCallback(
    (slot) => {
      if (numberSlot === totalSelected && !slot.isCheck) {
        return '#E9EBEE';
      } else if (slot.isCheck) {
        return Colors.primary;
      }
      return Colors.azure;
    },
    [numberSlot, totalSelected]
  );

  // Format time for display
  const formatSlotTime = useCallback(
    (startTime, endTime) =>
      `${moment(startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')}-${moment(endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')}`,
    []
  );

  const onSelectSlot = (index) => {
    const currentSlot = slots[index];
    const isCheck = currentSlot.isCheck;
    // if select outside flag then clear all check
    if (!isCheck && !currentSlot.isFlag) {
      slots.forEach((item) => {
        item.isCheck = false;
      });
    }
    currentSlot.isCheck = !isCheck;
    slots.forEach((item, idx) => {
      if (!item.isCheck) {
        // next item
        if (idx < slots.length - 2 && slots[idx + 1].isCheck) {
          item.isFlag = true;
          return;
        }
        // previous item
        if (idx > 0 && slots[idx - 1].isCheck) {
          item.isFlag = true;
          return;
        }
      }
      item.isFlag = false;
    });

    onSlotsChange([...slots]);
  };

  return (
    <Container>
      <TimeSlotBox>
        {_.size(slots) > 0 ? (
          slots.map((item, index) =>
            item.isAvailable ? (
              <TimeSlot
                key={index.toString()}
                activeOpacity={0.9}
                onPress={() => onSelectSlot(index)}
                disabled={numberSlot === totalSelected && !item.isCheck}
                backgroundColor={getSlotColor(item)}
              >
                {item.isFlag && !item.isCheck && showFlag && <SlotFlag />}
                <SlotText>{formatSlotTime(item.startTime, item.endTime)}</SlotText>
              </TimeSlot>
            ) : (
              <UnavailableSlot key={index.toString()}>
                <SlotText>{formatSlotTime(item.startTime, item.endTime)}</SlotText>
              </UnavailableSlot>
            )
          )
        ) : (
          <EmptySlotMessage>
            <SlotText text="BK_NEW_SLOT_EMPTY" />
          </EmptySlotMessage>
        )}
      </TimeSlotBox>
    </Container>
  );
};

const FormSlotView = ({ name, label, required, onChange, ...props }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  return (
    <FormControl label={label} error={error} required={required}>
      <SlotView
        onSlotsChange={(newSlots) => {
          setFieldValue(newSlots);
          onChange?.(newSlots);
        }}
        title={label}
        isRequired={required}
        slots={value}
        {...props}
      />
    </FormControl>
  );
};

export default FormSlotView;
