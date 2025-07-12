import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ItemJR from '../ItemJR';
import { JR_STATUS_ID } from '../../../Config/Constants';

describe('ItemJR', () => {
  const mockItem = {
    id: 123,
    startDate: '2023-06-30T09:00:00.000Z',
    targetResponseDate: '2023-07-01T09:00:00.000Z',
    fullUnitCode: 'ABC123',
    haveOfficeSigning: true,
    haveMaintenanceSigning: false,
    statusId: JR_STATUS_ID.RESOLVED, // define this status to show Preview and Signing Button
    isQuickCreate: false,
    description: 'Lorem ipsum dolor sit amet',
    users: [
      {
        displayName: 'John Doe',
      },
    ],
    creatorUser: {
      displayName: 'Jane Smith',
    },
  };

  const onPressMock = jest.fn();
  const onPressSignMock = jest.fn();
  const onPressPreviewMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    const { getByText } = render(
      <ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />
    );

    expect(getByText(`#${mockItem.id}`)).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('ABC123')).toBeTruthy();
    expect(getByText('Lorem ipsum dolor sit amet')).toBeTruthy();
    expect(getByText('COMMON_CREATION_TIME')).toBeTruthy();
    expect(getByText('JR_TARGET_RESPONSE_DATE')).toBeTruthy();
  });

  it('should call the onPress function when the item is pressed', () => {
    const { getByTestId } = render(
      <ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />
    );

    fireEvent.press(getByTestId('item-wrapper'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should call the onPressSign function when the sign button is pressed', () => {
    const { getByTestId } = render(
      <ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />
    );

    fireEvent.press(getByTestId('sign-button'));
    expect(onPressSignMock).toHaveBeenCalledTimes(1);
  });

  it('should call the onPressPreview function when the preview button is pressed', () => {
    const { getByTestId } = render(
      <ItemJR item={mockItem} onPress={onPressMock} onPressSign={onPressSignMock} onPressPreview={onPressPreviewMock} />
    );

    fireEvent.press(getByTestId('preview-button'));
    expect(onPressPreviewMock).toHaveBeenCalledTimes(1);
  });
});
