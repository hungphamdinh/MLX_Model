import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Colors } from '@Themes';
import { RequiredText, Text } from '@Elements';
import I18n from '@I18n';
import Row from '../../../../../../Grid/Row';
import { IconButtonRequired } from '..';
import DefectCheckBox from './defectCheckBox';

const Wrapper = styled.View`
  margin-top: -7;
`;

const DefectText = styled(Text)`
  color: ${({ disabled }) => (disabled ? Colors.light : '#4A89E8')};
  font-weight: 500;
`;

const DefectView = (props) => {
  const { formName, uaqDefectDescription, isDefect, onDefectPress, disabled } = props;

  return (
    <View>
      <Row>
        <DefectCheckBox {...props} />
        {isDefect && (
          <Wrapper>
            <IconButtonRequired
              disabled={disabled && !isDefect}
              name=""
              icon="create-outline"
              onPress={onDefectPress}
              badge={uaqDefectDescription && uaqDefectDescription.length > 0 ? 1 : 0}
              formName={formName}
              errorField="uaqDefectDescription"
              style={{ marginBottom: 0 }}
            />
          </Wrapper>
        )}
      </Row>
      <Text style={{ marginTop: isDefect ? -20 : 0 }}>
        <DefectText disabled={disabled}>{isDefect ? I18n.t('FORM_DEFECT') : I18n.t('FORM_NO_DEFECT')}</DefectText>
        {isDefect && <RequiredText />}
      </Text>
    </View>
  );
};

export default DefectView;
