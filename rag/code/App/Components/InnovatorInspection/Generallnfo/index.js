import React, { Fragment } from 'react';
import _ from 'lodash';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import { FormInput, FormCheckBox, FormDate } from '../../../Components/Forms';
import Row from '../../../Components/Grid/Row';
import I18n from '../../../I18n';
import { INSPECTION_MARCHING_TYPE } from '../../../Config/Constants';
import { parseDate } from '../../../Utils/transformData';
import useFeatureFlag from '../../../Context/useFeatureFlag';

const GeneralInfo = ({ initValues, formMethods: { setFieldValue, value }, navigation, hadSignature = false }) => {
  const defaultValues = {
    tenancyName: '',
    premises: '',
    landlord: '',
    occupant: '',
    marchingType: 0,
    marchingIn: true,
    marchingDate: undefined,
    startDate: undefined,
    ...initValues,
  };
  const marchingTypes = [
    {
      id: 0,
      name: I18n.t('INSPECTION_MARCHING_IN'),
      formName: 'marchingIn',
    },
    {
      id: 1,
      name: I18n.t('INSPECTION_MARCHING_OUT'),
      formName: 'marchingOut',
    },
  ];
  const routeName = _.get(navigation, 'state.routeName');
  const isAddNew = routeName === 'generalInfo';

  const {
    inspection: { inspectionDetailInfo },
  } = useInspection();

  const { isEnableLiveThere } = useFeatureFlag();
  const closedDate = value?.closedDate;

  React.useEffect(() => {
    initValue(defaultValues);
  }, []);

  React.useEffect(() => {
    if (!isAddNew) {
      initValue(inspectionDetailInfo);
    }
  }, [inspectionDetailInfo]);

  const initValue = (data) => {
    Object.keys(defaultValues).forEach((key) => {
      setFieldValue(key, data[key]);
    });
    if (data.marchingType === INSPECTION_MARCHING_TYPE.IN) {
      setFieldValue('marchingIn', true);
    } else if (data.marchingType === INSPECTION_MARCHING_TYPE.OUT) {
      setFieldValue('marchingOut', true);
    }
    if (data.workflow) {
      setFieldValue('startDate', parseDate(data.workflow.startDate));
    }
  };

  const onChangeCheckBox = (formName) => {
    if (formName === 'marchingIn') {
      setFieldValue('marchingOut', false);
    } else {
      setFieldValue('marchingIn', false);
    }
  };

  const inputProps = {
    maxTextLength: 200,
    mode: 'small',
    editable: !hadSignature,
  };

  return (
    <Fragment>
      <FormInput label="INSPECTION_PREMISES" {...inputProps} name="premises" />
      <FormInput label="INSPECTION_LANLORD" {...inputProps} name="landlord" />
      <FormInput label="INSPECTION_TENANT_NAME" {...inputProps} name="tenancyName" />
      <FormInput label="INSPECTION_OCCUPANT" {...inputProps} name="occupant" />
      <FormDate
        label={isEnableLiveThere ? 'INSPECTION_DATE' : 'INSPECTION_PRE_INSPECTION_DATE'}
        name="startDate"
        mode="datetime"
        maximumDate={closedDate}
        small
        disabled={hadSignature}
      />
      {!isEnableLiveThere && (
        <FormDate
          labelChild={
            <Row>
              {marchingTypes.map((item) => (
                <FormCheckBox
                  containerStyle={{ marginHorizontal: 10 }}
                  key={`${item.id}`}
                  onChange={() => onChangeCheckBox(item.formName)}
                  isRadioBtn
                  label={item.name}
                  name={`${item.formName}`}
                  disabled={hadSignature}
                />
              ))}
            </Row>
          }
          label="INSPECTION_MARCHING_IN_OUT_DATE"
          name="marchingDate"
          mode="datetime"
          small
          disabled={hadSignature}
        />
      )}
    </Fragment>
  );
};

export default GeneralInfo;
