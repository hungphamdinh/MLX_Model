import React from 'react';
import { render } from '@testing-library/react-native';
import { ItemVisitorDetail } from './index';

const mockItem = {
  code: '12345',
  createdAt: '2022-02-22T10:30:00Z',
  fullUnitId: 'ABC123',
  username: 'Test User',
  numberOfVisitors: 2,
  visitorInformations: [
    { id: '1', name: 'Visitor 1', phone: '123-456-7890', identityCardNumber: '123456' },
    { id: '2', name: 'Visitor 2', phone: '123-456-7890', identityCardNumber: '123456' },
  ],
  reasonForVisit: { id: '1', name: 'Business' },
  description: 'Test visit',
  registerTime: '2022-02-20T10:00:00.000Z',
  registerCheckOutTime: '2022-02-20T12:00:00.000Z',
  checkInTimes: [{ id: '1', value: '2022-02-20T11:00:00.000Z' }],
  checkOutTimes: [{ id: '2', value: '2022-02-20T13:00:00.000Z' }],
};

describe('ItemVisitorDetail', () => {
  it('renders the correct number of visitor information sections', () => {
    const { queryAllByTestId } = render(<ItemVisitorDetail item={mockItem} />);
    expect(queryAllByTestId('user-wrapper')).toHaveLength(2);
  });

  it('renders the correct unit ID', () => {
    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);
    expect(queryByText('ABC123')).not.toBeNull();
  });

  it('renders the correct visitor reason of visit', () => {
    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);
    expect(queryByText('Business')).not.toBeNull();
  });

  it('renders the correct description', () => {
    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);
    expect(queryByText('Test visit')).not.toBeNull();
  });

  // it('renders the check-in and check-out times correctly', () => {
  //   const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);
  //   expect(queryByText('20/02/2022 17:00:00')).not.toBeNull();
  //   expect(queryByText('20/02/2022 19:00:00')).not.toBeNull();
  // });

  it('renders the actual check-in and check-out times correctly', () => {
    const { queryByText } = render(<ItemVisitorDetail item={mockItem} />);
    expect(queryByText('20/02/2022 18:00:00')).not.toBeNull();
    expect(queryByText('20/02/2022 20:00:00')).not.toBeNull();
  });
});
