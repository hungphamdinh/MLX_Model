import { shallow } from 'enzyme';
import React from 'react';
import TemplateItem from './index';
import { StateProvider } from '../../../Context';

const props = {
  formName: 'Form Name',
  questionCount: 10,
  team: 'Team Name',
  category: 'Category',
  creatorUserName: 'Creator',
  status: { code: 'code' },
  publishCount: 5,
  onItemPress: jest.fn(),
  onEditPress: jest.fn(),
  onRemovePress: jest.fn(),
  onClonePress: jest.fn(),
  onSetGlobalPress: jest.fn(),
  onPublicPress: jest.fn(),
  onPublishToTeamPress: jest.fn(),
  isTeamLeader: true,
  isSelect: false,
  formType: 'formType',
  creationTime: 'creationTime',
};

jest.mock('../../../Context', () => ({
  StateProvider: ({ children }) => <div>{children}</div>,
}));

function renderTemplateItem() {
  return shallow(
    <StateProvider>
      <TemplateItem {...props} />
    </StateProvider>
  );
}
describe('TemplateItem', () => {
  it('renders without crashing', () => {
    renderTemplateItem();
  });
});

// describe('when allowUpdateForm is true', () => {
//   const wrapper = renderTemplateItem();
//
//   it('should render the correct buttons', () => {
//     expect(wrapper.find(SwipeableButton)).toHaveLength(1); // assuming btEdit is the only button rendered
//   });
//
//   describe('when formType is MY_FORM and statusCode is PUBLIC', () => {
//     beforeEach(() => {
//       wrapper.setProps({ formType: FormTypes.MY_FORM, statusCode: FormStatusCode.PUBLIC });
//     });
//
//     it('should render the correct buttons', () => {
//       expect(wrapper.find(SwipeableButton)).toHaveLength(2); // assuming btPublicToTeamForm is also rendered
//     });
//   });
//
//   describe('when formType is TEAM_FORM and user is team leader or is form owner', () => {
//     beforeEach(() => {
//       wrapper.setProps({ formType: FormTypes.TEAM_FORM, isMyForm: true, isTeamLead: true });
//     });
//
//     it('should render the correct buttons', () => {
//       expect(wrapper.find(SwipeableButton)).toHaveLength(2); // assuming btUnPublicToTeamForm is also rendered
//     });
//   });
//
//   describe('when user is team leader', () => {
//     beforeEach(() => {
//       wrapper.setProps({
//         isTeamLeader: true,
//         publishCount: 1,
//         statusCode: FormStatusCode.PUBLIC,
//       });
//     });
//
//     it('should render the correct buttons when statusCode is PUBLIC', () => {
//       expect(wrapper.find(Row)).toHaveLength(3); // assuming btMarkGlobal and btUnPublic are also rendered
//       expect(wrapper.find({ disabled: true, label: 'Mark Global' })).toHaveLength(1); // assuming btMarkGlobal is disabled
//     });
//
//     it('should render the correct buttons when statusCode is GLOBAL and isMyForm is true', () => {
//       wrapper.setProps({ statusCode: FormStatusCode.GLOBAL, isMyForm: true });
//       expect(wrapper.find(SwipeableButton)).toHaveLength(4); // assuming btUnMarkGlobal is also rendered
//     });
//
//     it('should render the correct buttons when statusCode is UN_PUBLIC', () => {
//       wrapper.setProps({ statusCode: FormStatusCode.UN_PUBLIC });
//       expect(wrapper.find(SwipeableButton)).toHaveLength(2); // assuming btPublic is also rendered
//     });
//
//     it('should render the correct buttons when formType is not MY_FORM and statusCode is GLOBAL', () => {
//       wrapper.setProps({ formType: FormTypes.TEAM_FORM, statusCode: FormStatusCode.GLOBAL });
//       expect(wrapper.find(SwipeableButton)).toHaveLength(2); // assuming btPublicToTeamForm is also rendered
//     });
//   });
//
//   describe('when user is not team leader', () => {
//     beforeEach(() => {
//       wrapper.setProps({ isTeamLeader: false });
//     });
//
//     it('should render the correct buttons when statusCode is PUBLIC', () => {
//       wrapper.setProps({ statusCode: FormStatusCode.PUBLIC });
//       expect(wrapper.find(SwipeableButton)).toHaveLength(1); // assuming btUnPublic is rendered
//     });
//   });
// });
