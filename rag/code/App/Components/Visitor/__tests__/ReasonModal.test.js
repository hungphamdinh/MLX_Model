import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReasonModal from '../ReasonModal';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';

describe('ReasonModal', () => {
  const mockSubmit = jest.fn();
  const mockOnClosePress = jest.fn();

  const renderComponent = () =>
    render(
      <FormProvider>
        <ReasonModal submit={mockSubmit} onClosePress={mockOnClosePress} />
      </FormProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText(I18n.t('COMMON_REASON'))).toBeTruthy();
  });

  it('validates input field and shows error on empty submit', async () => {
    const { getByText } = renderComponent();

    const confirmButton = getByText(I18n.t('COMMON_CONFIRM'));
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(getByText(I18n.t('AUTH_REQUIRED_FIELD'))).toBeTruthy();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits form and calls submit and onClosePress', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText(I18n.t('COMMON_REASON'));
    fireEvent.changeText(input, 'Test reason');

    const confirmButton = getByText(I18n.t('COMMON_CONFIRM'));
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('Test reason');
      expect(mockOnClosePress).toHaveBeenCalled();
    });
  });

  it('does not submit if form is invalid', async () => {
    const { getByText } = renderComponent();

    const confirmButton = getByText(I18n.t('COMMON_CONFIRM'));
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });
});
