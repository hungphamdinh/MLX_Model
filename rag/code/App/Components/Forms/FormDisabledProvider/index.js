import React, { createContext } from 'react';
export const FormDisabledContext = createContext();

const FormDisabledProvider = ({ disabled, children }) => {
  const cloneWithDisabledProp = (child) => {
    if (!React.isValidElement(child)) return child;

    const childProps = { ...child.props };

    // Check if the child component has a disabled or editable prop
    if (childProps.disabled !== undefined) {
      childProps.disabled = childProps.disabled;
    } else if (childProps.editable !== undefined) {
      childProps.disabled = !childProps.editable;
    } else {
      // If not, use the value from the provider
      childProps.disabled = disabled;
      childProps.editable = !disabled;
    }

    // Recursively apply to children
    return React.cloneElement(child, childProps, React.Children.map(child.props.children, cloneWithDisabledProp));
  };

  return (
    <FormDisabledContext.Provider value={{ disabled, editable: !disabled }}>
      {React.Children.map(children, cloneWithDisabledProp)}
    </FormDisabledContext.Provider>
  );
};

export default FormDisabledProvider;
