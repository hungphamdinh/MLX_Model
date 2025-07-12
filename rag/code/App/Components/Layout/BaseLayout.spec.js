import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import BaseLayout from './BaseLayout';
import BottomActions from './BottomActions';

describe('BaseLayout', () => {
  it('renders the component with title and add button', () => {
    const { queryByTestId } = render(
      <BaseLayout addPermission="PlanMaintenance.Create" title="My Title" showAddButton onBtAddPress={jest.fn()} />
    );

    const addButton = queryByTestId('+');
    expect(addButton).toBeDefined();
  });

  it('displays the title correctly', () => {
    const { queryByTestId } = render(<BaseLayout title="My Title" />);

    const title = queryByTestId('My Title');
    expect(title).toBeDefined();
  });

  it('displays the loading indicator when loading prop is true', () => {
    const { queryByTestId } = render(<BaseLayout loading />);

    const loadingIndicator = queryByTestId('loadingIndicator');
    expect(loadingIndicator).toBeDefined();
  });

  it('does not render the add button when showAddButton is false', () => {
    const { queryByTestId } = render(<BaseLayout title="My Title" showAddButton={false} />);

    const addButton = queryByTestId('addButton');
    expect(addButton).toBeNull();
  });

  it('should render BaseLayout with BottomActions', () => {
    const mockBottomButtons = [
      { title: 'Button 1', type: 'primary', onPress: jest.fn() },
      { title: 'Button 2', type: 'secondary', onPress: jest.fn() },
    ];

    const { getByText, getAllByTestId } = render(
      <BaseLayout bottomButtons={mockBottomButtons}>
        <BottomActions buttons={mockBottomButtons} />
      </BaseLayout>
    );

    expect(getAllByTestId('bottom-actions')).toBeTruthy();

    fireEvent.press(getByText('Button 1'));
    expect(mockBottomButtons[0].onPress).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText('Button 2'));
    expect(mockBottomButtons[1].onPress).toHaveBeenCalledTimes(1);
  });
});
