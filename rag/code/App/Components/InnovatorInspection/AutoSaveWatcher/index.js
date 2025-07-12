import { useEffect, useCallback, useState } from 'react';
import _ from 'lodash';
import { useWatch, useFormContext } from 'react-hook-form';
import { getFormStructureJson } from '../../../Utils/inspectionUtils';
import logService from '../../../Services/LogService';

const log = logService.extend('AutoSaveWatcher');

function AutoSaveWatcher({ handleAutosave }) {
  const [prevFormPagesLength, setPrevFormPagesLength] = useState(0);
  const dataForm = useWatch();
  const { setValue, clearErrors } = useFormContext();
  const onDataChange = useCallback(
    _.debounce(() => {
      handleAutosave();
    }, 1000),
    []
  );

  const updateFormPageIndex = useCallback(() => {
    log.info('updateFormPageIndex');
    _.forEach(dataForm?.formPages, (item, index) => {
      setValue(`formPages[${index}].pageIndex`, index);
    });
  }, [dataForm, setValue]);

  useEffect(() => {
    if (handleAutosave) {
      onDataChange();
      if (dataForm.lastFormErrorStructure) {
        handleFormStructureChange(dataForm.lastFormErrorStructure);
      }
    }
  }, [dataForm]);

  useEffect(() => {
    const formPageLength = _.size(dataForm?.formPages);
    if (formPageLength !== prevFormPagesLength) {
      updateFormPageIndex();
      setPrevFormPagesLength(formPageLength);
    }
  }, [dataForm?.formPages, prevFormPagesLength, updateFormPageIndex]);

  const handleFormStructureChange = useCallback(
    (lastFormErrorStructure) => {
      // check last form error with current form structure
      const currentFormStructure = getFormStructureJson(dataForm);
      const isSame = _.isEqual(lastFormErrorStructure, currentFormStructure);
      if (!isSame) {
        // clear all error
        clearErrors();
        setValue('lastFormErrorStructure', null);
      }
    },
    [dataForm]
  );

  return null;
}

export default AutoSaveWatcher;
