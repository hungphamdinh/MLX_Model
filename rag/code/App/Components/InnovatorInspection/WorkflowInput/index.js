import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { FormDate, FormDropdown, FormInput, FormLazyDropdown, FormNumberInput } from '../../Forms';
import FormSuggestionPicker from '../../Forms/FormSuggestionPicker';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import { Colors } from '../../../Themes';
import { Text } from '../../../Elements';

const ShowPropertyTitle = styled(Text)`
  color: ${Colors.azure};
  text-align: right;
  margin-bottom: 10px;
`;

const PropertyInfo = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <ShowPropertyTitle text="INSPECTION_SHOW_PROPERTY_INFORMATION" />
  </TouchableOpacity>
);

const withWorkflow = (WrappedComponent) => (props) => {
  const { workflowField, ...restProps } = props;
  const {
    inspection: { inspectionDetailInfo },
  } = useInspection();
  const fields = inspectionDetailInfo?.workflow;

  const property = _.get(fields, 'propertyPermissions', []).find((item) => item.propertyName === workflowField) || {};

  if (!property.isVisible) {
    return null;
  }

  const isInput = _.includes(
    ['Subject', 'Description', 'RescheduleRemark', 'DoneRatio', 'EstimatedHours'],
    workflowField
  );

  const wfProps = {
    isRequired: property.isRequired,
    required: property.isRequired,
  };

  if (isInput) {
    wfProps.editable = !property.isReadOnly;
  } else {
    wfProps.disabled = property.isReadOnly;
  }

  return <WrappedComponent {...restProps} {...wfProps} />;
};

export const WorkflowInput = withWorkflow(FormInput);
export const WorkflowNumberInput = withWorkflow(FormNumberInput);
export const WorkflowDropdown = withWorkflow(FormDropdown);
export const WorkflowSuggestionPicker = withWorkflow(FormSuggestionPicker);
export const WorkflowDatePicker = withWorkflow(FormDate);
export const WorkflowLazyDropdown = withWorkflow(FormLazyDropdown);
export const WorkflowPropertyInfo = withWorkflow(PropertyInfo);
