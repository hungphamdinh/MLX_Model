import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ListHistory from './';
import { mockUseInspection } from '../../../../../../jestSetup';

describe('ListHistory', () => {
  it('should render AppList component with the correct props', () => {
    const { getByTestId } = render(<ListHistory workflow={{}} />);
    const appList = getByTestId('app-list');

    expect(appList).toBeTruthy();
    expect(appList.props.data).toEqual([]);
    expect(appList.props.renderItem).toBeInstanceOf(Function);
  });

  it('should call getChangeHistories when component mounts', () => {
    render(<ListHistory workflow={{}} />);

    expect(mockUseInspection.getChangeHistories).toHaveBeenCalled();
  });

  it('should call getChangeHistories only once when component updates', () => {
    const { rerender } = render(<ListHistory workflow={{}} />);
    rerender(<ListHistory workflow={{}} />);

    expect(mockUseInspection.getChangeHistories).toHaveBeenCalled();
  });

  it('should call getChangeHistories with the correct parameters when loadData is invoked', () => {
    const { getByTestId } = render(<ListHistory workflow={{ creationTime: '2023-06-14', form: { id: '123' } }} />);
    const appList = getByTestId('app-list');

    fireEvent(appList, 'loadData', { page: 2 });

    expect(mockUseInspection.getChangeHistories).toHaveBeenCalledWith({
      page: 2,
      fromDate: '2023-06-14',
      id: '123',
    });
  });

  it('should return the correct key from the keyExtractor', () => {
    const { getByTestId } = render(<ListHistory workflow={{}} />);
    const appList = getByTestId('app-list');
    const keyExtractor = appList.props.keyExtractor;
    const item = { id: 'abc' };
    const key = keyExtractor(item);

    expect(key).toBe('abc');
  });
});
