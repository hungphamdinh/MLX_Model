import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CheckBoxModal from '../CheckBoxModal';

describe('CheckBoxModal', () => {
  test('clicking on the "Save" button calls the onSubmit function', () => {
    const onSubmit = jest.fn();
    const data = [
      { id: 1, title: 'Option 1', isCheck: false },
      { id: 2, title: 'Option 2', isCheck: true },
    ];

    const { getByTestId } = render(<CheckBoxModal onSubmit={onSubmit} data={data} onClosePress={() => jest.fn()} />);
    const saveButton = getByTestId('buttonSign');
    fireEvent.press(saveButton);
    expect(onSubmit).toHaveBeenCalled();
  });
});
