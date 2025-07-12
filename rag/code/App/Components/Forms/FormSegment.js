/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import FormControl, { useCommonFormController } from './FormControl';
import SegmentControl from '../segmentControl';

const FormSegment = ({ label, name, icon, containerStyle, isTransparent, ...props }) => {
  const { value, setFieldValue } = useCommonFormController(name);

  return (
    <FormControl label={label} icon={icon} style={containerStyle}>
      <SegmentControl {...props} selectedIndex={value} onChange={setFieldValue} isTransparent={isTransparent} />
    </FormControl>
  );
};
export default FormSegment;
