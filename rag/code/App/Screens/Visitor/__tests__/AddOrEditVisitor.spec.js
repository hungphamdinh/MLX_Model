// write tests, use commmon function like setupPinCode.test.js

import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import AddOrEditVisitor from '../AddOrEditVisitor';
import { renderScreen } from '../../../../__mock__/mockApp';
import { INITIAL_STATE } from '../../../Context/Visitor/Reducers';

const defaultState = INITIAL_STATE;

const renderAddOrEditVisitor = (state = defaultState, routeName) =>
  renderScreen(<AddOrEditVisitor />)({
    routeName,
    store: {
      app: {},
      visitor: {
        ...state,
        visitorDetail: {
          isActive: true,
          reasonForVisit: {},
        },
      },
      file: {
        fileUrls: [],
      },
    },
  });

const renderAddVisitor = (state = defaultState) => renderAddOrEditVisitor(state, 'addVisitor');

const renderEditVisitor = (state = defaultState) => renderAddOrEditVisitor(state, 'editVisitor');

describe('AddVisitor', () => {
  it('renders add visitor without crashing', () => {
    renderAddOrEditVisitor();
  });

  // render add visitor
  it('renders add visitor correctly', async () => {
    const { getByText, queryByText } = renderAddVisitor();
    // debug with no props
    expect(getByText('VS_NEW')).toBeTruthy();
    expect(getByText('VS_INFORMATION')).toBeTruthy();
    expect(getByText(/VS_NEW_INFO_NAME/)).toBeTruthy();
    expect(queryByText(/VS_NEW_INFO_PHONE/)).toBeTruthy();
    expect(getByText('VS_NEW_INFO_ID')).toBeTruthy();
    expect(getByText('VISITOR_ADD')).toBeTruthy();
    expect(getByText('AD_CRWO_TITLE_EXPECTED_DATE')).toBeTruthy();
    expect(getByText(/VS_NEW_INFO_TIME1/)).toBeTruthy();
    expect(getByText(/VS_NEW_INFO_TIME2/)).toBeTruthy();
    expect(getByText('VISITOR_ACTUAL_CHECK_IN_OUT')).toBeTruthy();
    expect(getByText('VISITOR_ACTUAL_CHECK_IN')).toBeTruthy();
    expect(getByText('VISITOR_ACTUAL_CHECK_OUT')).toBeTruthy();
    expect(getByText('FB_PROBLEM')).toBeTruthy();
    expect(getByText('COMMON_DOCUMENT')).toBeTruthy();
    expect(getByText(/VS_NUM_OF_VISITOR/)).toBeTruthy();

    const numOfVisitorInput = screen.getByPlaceholderText('VS_NUM_OF_VISITOR');
    fireEvent.changeText(numOfVisitorInput, '5');
  });

  it('renders edit visitor correctly', async () => {
    const { getByText } = renderEditVisitor();
    expect(getByText('VS_EDIT')).toBeTruthy();
  });
});
