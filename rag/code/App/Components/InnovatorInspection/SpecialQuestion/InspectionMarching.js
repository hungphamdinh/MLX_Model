import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FormDropdown } from '../../Forms';
import Row from '../../Grid/Row';
import { Text } from '../../../Elements';
import { useCommonFormController } from '../../Forms/FormControl';
import { AppInput } from '../../Forms/FormInput';
import { TableNames, generateInspectionUUID } from '../../../Services/OfflineDB/IDGenerator';

const Wrapper = styled(View)`
  margin-top: 5px;
`;

const Label = styled(Text)`
  flex: 0.07;
  margin-top: 5px;
`;

const InputWrapper = styled.View`
  flex: 0.9;
`;

const PhotographTitle = styled(Text)`
  margin-right: 10px;
`;

const options = [
  {
    icon: 'check',
    colorCode: '#a8e5eb',
    description: 'Yes',
    id: 1,
  },
  {
    icon: 'close',
    colorCode: '#e59ea9',
    description: 'No',
    id: 2,
  },
];

const InspectionMarching = ({ setFieldValue, formName, dropdownProps, optionProps, ...baseProps }) => {
  const { value } = useCommonFormController(formName);

  // Generate id for marching if it is not exist
  React.useEffect(() => {
    if (!value.uaqMarchingId) {
      setFieldValue(`${formName}.uaqMarchingId`, generateInspectionUUID(TableNames.formUserAnswerQuestionMarching));
    }
  }, [value.uaqMarchingId]);

  return (
    <View {...baseProps}>
      <FormDropdown
        labelStyle={optionStyles.dropdownMarching}
        {...dropdownProps}
        mode="small"
        required
        placeholder="INSPECTION_PLEASE_CHOOSE_AN_OPTION"
      />
      <Wrapper>
        <FormPhotographTaken optionProps={optionProps} name={`${formName}.uaqAnswerIsPhotographTaken`} />
      </Wrapper>
      <Wrapper>
        <FormPhotoInput name={`${formName}.uaqAnswerTexts`} />
      </Wrapper>
    </View>
  );
};

export default InspectionMarching;

const FormPhotographTaken = ({ name, optionProps }) => {
  const [photographTakenOptions, setPhotographTakenOptions] = useState(options);
  const { value, setFieldValue } = useCommonFormController(name);

  React.useEffect(() => {
    if (value) {
      onItemPress(1);
    } else if (value === false) {
      onItemPress(2);
    }
  }, []);

  const onItemPress = (templateId) => {
    const selectedData = options.map((data) => ({
      ...data,
      isActive: data.id === templateId,
    }));
    setPhotographTakenOptions(selectedData);
    setFieldValue(selectedData.findIndex((item) => item.id === 1 && item.isActive) > -1);
  };
  return (
    <Row center>
      <PhotographTitle preset="bold" text="FORM_PHOTOGRAPH_TAKEN" />
      {photographTakenOptions.map((item, index) => (
        <PhotographTaken
          key={index.toString()}
          {...optionProps}
          isActive={item.isActive}
          item={item}
          onItemPress={onItemPress}
          options={photographTakenOptions}
        />
      ))}
    </Row>
  );
};

const PhotographTaken = ({ item, isActive, onItemPress }) => {
  const iconColor = isActive ? 'white' : 'black';
  const backgroundColor = isActive ? item.colorCode : 'white';
  const borderWidth = isActive ? 0 : 1;
  return (
    <Row style={optionStyles.iconButton} key={`${item.id}`}>
      <TouchableOpacity
        style={[
          optionStyles.iconContainer,
          {
            backgroundColor,
            borderWidth,
          },
        ]}
        onPress={() => onItemPress(item.id)}
      >
        <Icon size={25} name={item.icon} color={iconColor} />
      </TouchableOpacity>
      <Text preset="medium" style={optionStyles.description}>
        {item.description}
      </Text>
    </Row>
  );
};

const FormPhotoInput = ({ name }) => {
  const { setFieldValue, value } = useCommonFormController(name);
  const defaultOptions = ['', '', '', '', ''];
  const inputOptions = value || defaultOptions;

  const onChangeText = (val, index) => {
    const text = inputOptions.map((item, idx) => {
      if (idx === index) {
        item = val;
      }
      return item;
    });
    setFieldValue(text);
  };
  return (
    <Wrapper>
      {inputOptions.map((item, index) => (
        <Row key={index.toString()}>
          <Label text={`${index + 1}.`} />
          <InputWrapper>
            <AppInput
              onChangeText={(text) => onChangeText(text, index)}
              mode="small"
              key={index.toString()}
              value={item}
            />
          </InputWrapper>
        </Row>
      ))}
    </Wrapper>
  );
};
const optionStyles = {
  container: {
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: 15,
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.3,
    elevation: 10,
  },
  iconButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  dropdownMarching: {
    fontFamily: 'Gotham-Medium',
    fontWeight: 'bold',
    fontSize: 13,
  },
};
