import React from 'react';
import { shallow } from 'enzyme';
import { fireEvent, render } from '@testing-library/react-native';
import ItemVisitor from './index';

describe('ItemVisitor', () => {
  const mockItem = {
    id: '1',
    code: '1234',
    createdAt: '2022-02-20T00:00:00.000Z',
    numberOfVisitors: 2,
    reasonForVisit: { name: 'Delivery' },
    fullUnitId: 'Building A, Floor 5, Unit 501',
    registerTime: '2022-02-20T10:00:00.000Z',
    registerCheckOutTime: '2022-02-20T12:00:00.000Z',
  };

  it('should render without crashing', () => {
    shallow(<ItemVisitor item={mockItem} />);
  });

  it('should call onPress function when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ItemVisitor item={mockItem} onPress={onPress} />);
    const wrapper = getByTestId('wrapper');
    fireEvent.press(wrapper);
    expect(onPress).toHaveBeenCalled();
  });

  it('should display item information correctly', () => {
    const { getByText } = render(<ItemVisitor item={mockItem} />);
    expect(getByText('#1234')).toBeTruthy();
    expect(getByText('Delivery')).toBeTruthy();
    expect(getByText('Building A, Floor 5, Unit 501')).toBeTruthy();
    // expect(getByText('20/02/2022 17:00:00')).toBeTruthy();
    // expect(getByText('20/02/2022 19:00:00')).toBeTruthy();
  });
});
