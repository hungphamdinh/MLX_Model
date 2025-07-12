import React, { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import ReactNativeBiometrics from 'react-native-biometrics';
import I18n from '../I18n';
import { handleBiometricError } from './func';

export function useStateDelay(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setStateDelay = useCallback((newState, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(newState);

    setTimeout(() => {
      cb(newState);
    }, 200);
  }, []);

  return [state, setStateDelay];
}

function replaceBracketWithDot(str) {
  const regex = /\[(\d+)\]/g;
  return str.replace(regex, '.$1');
}

export function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setStateCallback = useCallback((newState, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(newState);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

export const useYupValidationResolver = (validationSchema) =>
  useCallback(
    async (data) => {
      if (!validationSchema) {
        return {
          values: data,
          errors: {},
        };
      }

      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return {
          values: {},
          errors: transformYupValidationErrors(error),
        };
      }
    },
    [validationSchema]
  );

export const transformYupValidationErrors = (error) => {
  if (error.inner) {
    return error.inner.reduce(
      (allErrors, currentError) => ({
        ...allErrors,
        [replaceBracketWithDot(currentError.path)]: {
          type: currentError.type ?? 'validation',
          message: currentError.message,
        },
      }),
      {}
    );
  }
  return {};
};

export function compareMemoProps(prevProps, nextProps, fields, elementName) {
  // console.log('are equal ', elementName);

  let isSame = true;
  fields.every((field) => {
    const type = typeof prevProps[field];
    if (type === 'object') {
      const prevObjectString = JSON.stringify(prevProps[field]);
      const nextObjectString = JSON.stringify(nextProps[field]);
      if (prevObjectString !== nextObjectString) {
        isSame = false;
        return false;
      }
    } else if (prevProps[field] !== nextProps[field]) {
      isSame = false;
      return false;
    }
    return true;
  });
  return isSame;
}

export const useFormMemo = (element, fields) =>
  React.memo(element, (prevProps, nextProps) => compareMemoProps(prevProps, nextProps, fields, element.name));

export const useCompatibleForm = (props) => {
  const formProps = useForm(props);
  return {
    ...formProps,
    values: formProps.formState,
    setFieldValue: formProps.setValue,
    setFieldError: formProps.setError,
  };
};

export const useBiometrics = (isTurnOnBiometric) => {
  const [availableSensor, setAvailableSensor] = React.useState(undefined);
  
  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

  // Check if biometric sensor is available on the device.
  const checkBiometricSupport = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (available && biometryType) {
      setAvailableSensor(biometryType);
    }
  };

  // Prompt the user for biometric authentication.
  const promptBiometric = async () => {
    try {
      const promptMessage =
        availableSensor === 'FaceID'
          ? I18n.t('AUTH_SCAN_YOUR_FACE_DESCRIPTION')
          : I18n.t('AUTH_SCAN_YOUR_FINGER_DESCRIPTION');
      const result = await rnBiometrics.simplePrompt({ promptMessage });
      return result.success;
    } catch (error) {
      handleBiometricError(availableSensor === 'FaceID', error.message);
      return false;
    }
  };

  // Run the support check on mount.
  React.useEffect(() => {
    if(isTurnOnBiometric) {
      checkBiometricSupport();
    }
  }, []);

  return { availableSensor, promptBiometric, checkBiometricSupport, rnBiometrics };
};
