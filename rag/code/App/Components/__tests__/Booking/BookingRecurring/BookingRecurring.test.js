// App/Components/__tests__/Booking/BookingRecurring/BookingRecurring.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useCommonFormController } from '@Components/Forms/FormControl';
import BookingRecurring from '../../../Booking/BookingRecurring';

jest.mock('@Components/Forms/FormControl', () => ({
  useCommonFormController: jest.fn(),
}));

jest.mock('../../../InfoText', () => (props) => {
  const { Text } = require('react-native');
  return <Text testID="recurrence-info">{props.value ?? props.label}</Text>;
});

jest.mock('@Components/Booking/BookingRecurring/RecurrenceModal', () => (props) => {
  const { View } = require('react-native');
  return (
    <View
      testID="recurrence-modal"
      visible={props.visible}
      onClose={props.onClose}
    />
  );
});

describe('BookingRecurring component', () => {
  const mockOnSubmit = jest.fn();
  const mockSchedule = { foo: 'bar' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows placeholder when no recurrence is set', () => {
    useCommonFormController.mockReturnValue({ value: null });
    const { getByTestId } = render(
      <BookingRecurring
        onSubmitForm={mockOnSubmit}
        schedule={mockSchedule}
        name="recurrence"
      />
    );
    const info = getByTestId('recurrence-info');
    // Placeholder should be I18n.t('COMMON_SELECT')
    expect(info.props.children).toBe('COMMON_SELECT');
  });

  it('displays the selected frequency when set', () => {
    useCommonFormController.mockReturnValue({
      value: { frequency: { name: 'Every Day' } },
    });
    const { getByTestId, debug } = render(
      <BookingRecurring
        onSubmitForm={mockOnSubmit}
        schedule={mockSchedule}
        name="recurrence"
      />
    );

    debug();
    const info = getByTestId('recurrence-info');
    expect(info.props.children).toBe('Every Day');
  });

  it('toggles the modal visibility on button press', () => {
    useCommonFormController.mockReturnValue({ value: null });
    const { getByTestId } = render(
      <BookingRecurring
        onSubmitForm={mockOnSubmit}
        schedule={mockSchedule}
        name="recurrence"
      />
    );

    const modalBefore = getByTestId('recurrence-modal');
    expect(modalBefore.props.visible).toBe(false);

    fireEvent.press(getByTestId('recurrence-button'));

    const modalAfterOpen = getByTestId('recurrence-modal');
    expect(modalAfterOpen.props.visible).toBe(true);

    // Simulate closing
    modalAfterOpen.props.onClose();
    const modalAfterClose = getByTestId('recurrence-modal');
    expect(modalAfterClose.props.visible).toBe(false);
  });
});
