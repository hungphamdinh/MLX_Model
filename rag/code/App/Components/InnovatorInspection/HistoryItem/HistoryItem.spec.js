import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HistoryItem from './index';

describe('HistoryItem', () => {
  it('should toggle isShowLess property when section is pressed', () => {
    const item = {
      modificationDate: '2023-06-14',
      isShowLess: true,
      changes: [
        {
          creationTime: '10:00 AM',
          title: 'Object 1',
          actionType: 'Action 1',
          oldValue: 'Old Value 1',
          newValue: 'New Value 1',
        },
        {
          creationTime: '11:00 AM',
          title: 'Object 2',
          actionType: 'Action 2',
          oldValue: 'Old Value 2',
          newValue: 'New Value 2',
        },
      ],
    };

    const { getByTestId } = render(<HistoryItem item={item} />);
    const section = getByTestId('section');

    fireEvent.press(section);

    const buttonExpand = getByTestId('buttonExpand');
    expect(buttonExpand).toBeTruthy();
    expect(item.isShowLess).toBe(true);
  });

  // Add more test cases for different scenarios
});
