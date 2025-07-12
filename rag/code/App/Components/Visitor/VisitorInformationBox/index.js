import React from 'react';
import styled from 'styled-components/native';
import { LayoutAnimation, View } from 'react-native';
import I18n from '@I18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFieldArray } from 'react-hook-form';

import { FormDisabledProvider, FormInput } from '../../../Components/Forms';
import { Text, Button, Box, Spacer } from '../../../Elements';
import ButtonExpand from '../../../Components/Visitor/ButtonExpand';
import { Colors } from '../../../Themes';
import Row from '../../Grid/Row';

const ButtonAdd = styled(Button)`
  margin-right: 2px;
  margin-left: -2px;
`;

const ButtonClose = styled(Button)``;

const BtnAddWrapper = styled(Row)`
  margin-bottom: 10px;
`;

const InputWrapper = styled.View`
  flex: 1;
`;
const VisitorInformationBox = ({ formMethods, disabled }) => {
  const [expanded, setExpand] = React.useState(true);

  const onExpandOrCollapse = (isExpand) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand(isExpand);
  };

  const {
    fields: visitorInformations,
    remove,
    append,
  } = useFieldArray({
    control: formMethods.control,
    name: 'visitorInformations',
    keyName: 'uniqueId',
  });

  const onAddVisitorInfo = () => {
    append({});
  };

  return (
    <Box title="VS_INFORMATION" rightView={<ButtonExpand expanded={expanded} onPress={onExpandOrCollapse} />}>
      {expanded && (
        <>
          {visitorInformations.length > 0 && (
            <View testID="visitor-informations">
              {visitorInformations.map((item, index) => {
                const firstItem = index === 0;
                return (
                  <View key={item.uniqueId} testID="visitor-information">
                    <FormDisabledProvider disabled={disabled}>
                      <FormInput
                        testID="visitor-name"
                        mode="small"
                        required={firstItem}
                        rightButton={
                          !firstItem ? (
                            <ButtonClose testID="remove-visitor-button" onPress={() => remove(index)}>
                              <Icon name="close-outline" color={Colors.azure} size={20} />
                            </ButtonClose>
                          ) : null
                        }
                        label={I18n.t('VS_NEW_INFO_NAME', undefined, index + 1)}
                        placeholder="VS_NEW_INFO_NAME_HOLDER"
                        name={`visitorInformations.${index}.name`}
                      />
                      <Row>
                        <InputWrapper>
                          <FormInput
                            testID="visitor-phone"
                            mode="small"
                            required={firstItem}
                            label="VS_NEW_INFO_PHONE"
                            keyboardType="number-pad"
                            placeholder="VS_NEW_INFO_PHONE_HOLDER"
                            name={`visitorInformations.${index}.phone`}
                          />
                        </InputWrapper>
                        <Spacer width={20} />
                        <InputWrapper>
                          <FormInput
                            testID="visitor-id"
                            mode="small"
                            keyboardType="number-pad"
                            label="VS_NEW_INFO_ID"
                            maxLength={4}
                            placeholder="VS_NEW_INFO_ID_HOLDER"
                            name={`visitorInformations.${index}.identityCardNumber`}
                          />
                        </InputWrapper>
                      </Row>
                    </FormDisabledProvider>
                  </View>
                );
              })}
            </View>
          )}
          {!disabled && (
            <BtnAddWrapper center>
              <ButtonAdd testID="add-visitor-button" onPress={onAddVisitorInfo}>
                <Icon name="add-circle" color={Colors.azure} size={20} />
              </ButtonAdd>
              <Text preset="bold" text="VISITOR_ADD" />
            </BtnAddWrapper>
          )}
        </>
      )}
    </Box>
  );
};

export default VisitorInformationBox;
