import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomActions from './BottomActions';

describe('BottomActions', () => {
  const buttons = [
    { title: 'Button 1', type: 'primary', onPress: jest.fn() },
    { title: 'Button 2', type: 'secondary', onPress: jest.fn() },
  ];
  it('should render buttons when expandVisible is true', () => {
    const { getByText } = render(<BottomActions buttons={buttons} expandVisible />);

    expect(getByText('Button 1')).toBeDefined();
    expect(getByText('Button 2')).toBeDefined();
  });

  it('should not render buttons when expandVisible is false', () => {
    const { queryByTestId } = render(<BottomActions buttons={buttons} expandVisible={false} />);

    expect(queryByTestId('button-0')).toBeNull();
    expect(queryByTestId('button-1')).toBeNull();
  });

  it('calls onPress function when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <BottomActions
        buttons={[
          { title: 'Button 1', type: 'primary', onPress: onPressMock },
        ]}
        expandVisible
      />
    );
    const button = getByText('Button 1');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('calls onPress function when button is pressed - render by testID', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <BottomActions
        buttons={[
          { title: 'Button 1', type: 'primary', onPress: onPressMock },
        ]}
        expandVisible
      />
    );
    const button = getByTestId('button-0');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
