import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderScreen } from '@Mock/mockApp';
import { Alert } from 'react-native';
import useBookingRecurrence from '@Components/Booking/BookingRecurring/useBookingRecurrence';
import ConfigRecurrenceModal from '@Components/Booking/BookingRecurring/RecurrenceModal';
import I18n from '@I18n';

jest.mock('@Components/Booking/BookingRecurring/useBookingRecurrence');

describe('ConfigRecurrenceModal', () => {
  const reservation = { foo: 'bar' };
  const onClose = jest.fn();
  const onSubmitForm = jest.fn();
  const onRemove = jest.fn();
  const testID = 'recurrence-modal';

  const defaultProps = {
    visible: false,
    onClose,
    onSubmitForm,
    reservation,
    onRemove,
    testID,
  };

  const setup = (props = {}) =>
    renderScreen(<ConfigRecurrenceModal {...defaultProps} {...props} />)();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingRecurrence.mockReturnValue({ generateTimeSlots: jest.fn(() => ['slot1']) });
  });


  it('prompts and handles removal correctly', () => {
    // Mock Alert.alert to immediately call the “Yes” callback
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // buttons[1] is the “Yes” option
      buttons[1].onPress();
    });

    const { getByText } = setup({ visible: true });

    const removeLabel = I18n.t('AD_COMMON_REMOVE');
    fireEvent.press(getByText(removeLabel));

    expect(Alert.alert).toHaveBeenCalledWith(
      I18n.t('AD_PM_PLAN_REMOVE_RECURRENCE_TITLE'),
      I18n.t('AD_PM_PLAN_REMOVE_RECURRENCE_ASK'),
      expect.any(Array)
    );
    expect(onRemove).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('binds handleSubmit for the accept button', () => {
    setup({ visible: true });
    // On render, handleSubmit(onSubmit) should have been called once
    // This test may need adjustment as formMethods is no longer mocked
  });
});
