/* @flow */
import React from 'react';

type ObjectType = {
  context: Object,
  mapping: (consumerValue: Object) => Object,
};

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'HOCWrapComponent';
const getScreenOptions = WrappedComponent => WrappedComponent.screenOptions || {};
const getNavigationOptions = WrappedComponent => WrappedComponent.navigationOptions || {};

const createPureComponent = (ConnectComponent: any, initProps: any) => {
  class TempNameComponent extends React.PureComponent<*> {
    render() {
      return <ConnectComponent {...this.props} {...initProps} />;
    }
  }
  TempNameComponent.displayName = `HOCPureComponent${getDisplayName(ConnectComponent)}`;
  return TempNameComponent;
};

const handleMapData = (ConnectComponent: any, params: Array<ObjectType> = [], result: Object) => {
  const [firstItem, ...orderItem] = params;
  const { context: ContextComponent, mapping: handleMapping } = firstItem;

  return (
    <ContextComponent.Consumer>
      {
        (value) => {
          const mapData = handleMapping(value) || {};
          const nextResult = { ...result, ...mapData };
          if (orderItem.length > 0) {
            return handleMapData(ConnectComponent, orderItem, nextResult);
          }
          return <ConnectComponent {...nextResult} />;
        }
      }
    </ContextComponent.Consumer>
  );
};

const connect = (ConnectComponent: any, params: Array<ObjectType> = []) => {
  const paramsLength = params.length;
  if (paramsLength === 0) return (component: any) => component;


  const returnComponent = (props: any) => {
    const ComponentWithNavigation = createPureComponent(ConnectComponent, props);
    return handleMapData(ComponentWithNavigation, params, {});
  };
  returnComponent.displayName = getDisplayName(ConnectComponent);
  returnComponent.navigationOptions = getNavigationOptions(ConnectComponent);
  returnComponent.navigationOptions = getNavigationOptions(ConnectComponent);
  returnComponent.screenOptions = getScreenOptions(ConnectComponent);

  return returnComponent;
};

export default connect;


// const mapToProps = [
//   {
//     context: AppContext,
//     mapping: consumerValue => ({
//       count: consumerValue.count,
//       //some item of object
//     }),
//   },
//   {
//     context: AuthContext,
//     mapping: consumerValue => ({
//       isLogined: consumerValue.isLogined,
//       //some item of object
//     }),
//   },
// ];
// export default connect(*ComponentName*, mapToProps);
