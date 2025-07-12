import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyReportItem from '../MyReportItem';
import { formatDate } from '../../../Utils/transformData';
import LocaleConfig from '../../../Config/LocaleConfig';

describe('MyReportItem', () => {
  const mockItem = {
    id: '123',
    fileName: 'Report.pdf',
    creationTime: '2022-01-01T10:00:00.000Z',
    completionDate: '2022-01-02T10:00:00.000Z',
    file: {
      uri: 'path/to/file',
    },
    statusId: 1,
  };

  const mockOnItemPress = jest.fn();

  const renderComponent = (item) => {
    return render(<MyReportItem item={item} onItemPress={mockOnItemPress} />);
  };

  it('renders correctly with a file', () => {
    const { getByText } = renderComponent(mockItem);

    expect(getByText(`#${mockItem.id}`)).toBeTruthy();
    expect(getByText(mockItem.fileName)).toBeTruthy();
    expect(getByText(formatDate(mockItem.creationTime, LocaleConfig.fullDateTimeFormat))).toBeTruthy();
    expect(getByText(formatDate(mockItem.completionDate, LocaleConfig.fullDateTimeFormat))).toBeTruthy();
    expect(getByText('COMPLETED')).toBeTruthy();
  });

  it('renders correctly without a file', () => {
    const itemWithoutFile = { ...mockItem, file: null, statusId: 2 };
    const { getByText } = renderComponent(itemWithoutFile);

    expect(getByText(`#${mockItem.id}`)).toBeTruthy();
    expect(getByText(mockItem.fileName)).toBeTruthy();
    expect(getByText(formatDate(mockItem.creationTime, LocaleConfig.fullDateTimeFormat))).toBeTruthy();
    expect(getByText(formatDate(mockItem.completionDate, LocaleConfig.fullDateTimeFormat))).toBeTruthy();
    expect(getByText('FAILED')).toBeTruthy();
  });

  it('calls onItemPress when pressed and file is present', () => {
    const { getByTestId } = renderComponent(mockItem);
    fireEvent.press(getByTestId('report-item-button'));
    expect(mockOnItemPress).toHaveBeenCalledWith(mockItem);
  });

  it('does not call onItemPress when file is null and TouchableOpacity is disabled', () => {
    const itemWithoutFile = { ...mockItem, file: null };
    const { getByTestId } = renderComponent(itemWithoutFile);
    const reportItemButton = getByTestId('report-item');

    expect(reportItemButton.props.disabled).toBe(true);
  });
});
