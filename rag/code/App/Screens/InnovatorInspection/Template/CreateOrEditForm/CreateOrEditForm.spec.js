import React from 'react';
import { shallow } from 'enzyme';
import CreateOrEditForm from './index';

describe('CreateOrEditForm', () => {
  const navigation = {
    getParam: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  it('renders correctly', () => {
    const wrapper = shallow(<CreateOrEditForm navigation={navigation} />);
    expect(wrapper).toMatchSnapshot();
  });
});
