/* eslint-disable no-restricted-syntax */
// NavigationService.js

import React from 'react';
import { StackActions, CommonActions, getActionFromState, getStateFromPath } from '@react-navigation/native';

export const navigationRef = React.createRef();

function setTopLevelNavigator(navigatorRef) {
  navigationRef.current = navigatorRef;
}

function navigate(routeName, params) {
  navigationRef.current?.navigate(routeName, params);
}

function goBack() {
  navigationRef.current?.goBack();
}

function pop(count) {
  navigationRef.current.dispatch(StackActions.pop(count));
}

function replace(routeName, params) {
  navigationRef.current.dispatch(StackActions.replace(routeName, params));
}

function popTo(routeName) {
  const state = navigationRef.current.getRootState();
  // Find the route we want to pop to
  const route = state.routes.find((r) => r.name === routeName);

  if (!route) {
    console.warn(`Can't pop to unknown route: ${routeName}`);
    return;
  }

  // Get the index of the route in the stack
  const index = state.routes.indexOf(route);

  navigationRef.current?.dispatch(() =>
    CommonActions.reset({
      ...state,
      routes: state.routes.slice(0, index + 1),
      index,
    })
  );
}

function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}

function navigateFromRoot(routeName) {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: routeName }],
  });
}

function linkTo(path, config = null) {
  const state = getStateFromPath(path, config);
  const action = getActionFromState(state);
  if (action !== undefined) {
    navigationRef?.current?.dispatch(action);
  }
}

function replaceRoot(routeName) {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: routeName }],
  });
}

function setParams(params) {
  navigationRef.current.setParams(params);
}
export default {
  navigate,
  replace,
  goBack,
  setTopLevelNavigator,
  navigateFromRoot,
  pop,
  linkTo,
  getCurrentRoute,
  replaceRoot,
  setParams,
  popTo,
};
