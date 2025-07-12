import React from 'react';
import { render } from '@testing-library/react-native';
import AddOrEditPlanTask from './';

describe('AddOrEditPlanTask', () => {
  const mockNavigation = {
    state: {
      routeName: 'addJobRequestTask', // Set this according to the scenario you want to test
    },
  };

  it('should render the component correctly', () => {
    render(<AddOrEditPlanTask navigation={mockNavigation} />);
  });
});