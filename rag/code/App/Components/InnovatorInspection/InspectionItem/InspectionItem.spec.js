import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import InspectionItem from './index';

describe('InspectionItem', () => {
  const mockOnItemPress = jest.fn();
  const mockInspection = {
    property: {
      address: '123 Main St',
      name: 'Test Property',
      isActive: true,
    },
  };
  const mockWorkflow = {
    status: {
      name: 'Pending',
      colorCode: '#FFA500',
    },
    subject: 'Test Inspection',
  };

  it('renders the correct information', () => {
    const { getByText } = render(
      <InspectionItem
        inspection={mockInspection}
        workflow={mockWorkflow}
        creationTime="2022-02-22T12:00:00Z"
        onItemPress={mockOnItemPress}
        syncState="synced"
      />
    );

    expect(getByText('Test Inspection')).toBeTruthy();
    expect(getByText('Test Property')).toBeTruthy();
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('22/02/2022')).toBeTruthy();
  });

  it('calls onItemPress when pressed', () => {
    const { getByTestId } = render(
      <InspectionItem
        inspection={mockInspection}
        workflow={mockWorkflow}
        creationTime="2022-02-22T12:00:00Z"
        onItemPress={mockOnItemPress}
        syncState="synced"
      />
    );

    fireEvent.press(getByTestId('inspection-item'));
    expect(mockOnItemPress).toHaveBeenCalled();
  });
});
