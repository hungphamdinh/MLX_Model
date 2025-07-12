import React from 'react';
import AddOrEditJobRequest from '../AddOrEditJobRequest';
import { renderScreen } from '../../../../__mock__/mockApp';

const navigation = {
  getParam: jest.fn(),
  navigate: jest.fn(),
};

describe('AddOrEditJobRequest', () => {
  it('renders without crashing', () => {
    renderScreen(<AddOrEditJobRequest navigation={navigation} />);
  });
});
