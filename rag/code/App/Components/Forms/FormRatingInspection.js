/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import I18n from '@I18n';
import FormControl, { useCommonFormController } from './FormControl';
import Row from '../Grid/Row';
import useForm from '../../Context/Form/Hooks/UseForm';
import { Text } from '../../Elements';
import { TableNames, generateInspectionUUID } from '../../Services/OfflineDB/IDGenerator';

export const RatingInspectionOption = React.memo(
  ({ isActive, onPress, colorCode, icon, names, description, disabled }) => {
    const destName = _.get(
      _.find(names, (nameObj) => nameObj.languageName === I18n.languageId),
      'value'
    );
    const optionName = _.size(destName) > 0 ? destName : description;

    const iconColor = isActive ? 'white' : 'black';
    const backgroundColor = isActive ? colorCode : 'white';
    const borderWidth = isActive ? 0 : 1;
    return (
      <View style={optionStyles.container}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            optionStyles.iconContainer,
            {
              backgroundColor,
              borderWidth,
            },
          ]}
          onPress={onPress}
        >
          <Icon size={25} name={icon} color={iconColor} />
        </TouchableOpacity>
        <Text preset="medium" style={optionStyles.description}>
          {optionName}
        </Text>
      </View>
    );
  }
);

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
};

const FormRatingInspection = ({ name, groupCode, translate, containerStyle, type, options, uaqId, ...restProps }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  const {
    form: { optionAnswerTemplates },
  } = useForm();
  //
  const pickTemplates = _.get(optionAnswerTemplates, groupCode, []).filter((item) =>
    _.includes(_.map(options, 'formQuestionAnswerTemplateId'), item.id)
  );
  const selectedOption = value && options.find((item) => item.id === _.get(value, 'value'));
  const selectedTemplate = _.get(selectedOption, 'formQuestionAnswerTemplateId');
  const onItemPress = (templateId) => {
    const selectedValue = options.find((item) => item.formQuestionAnswerTemplateId === templateId);
    // if value already has value, we just change the value id
    const tableId = _.get(value, 'id') || generateInspectionUUID(TableNames.formUserAnswerQuestionOption);
    const newValue = { ..._.cloneDeep(selectedValue), id: tableId, uaqId };
    setFieldValue(newValue);
  };

  return (
    <FormControl error={error} translate={translate} style={containerStyle}>
      <Row>
        {pickTemplates.map((template) => (
          <RatingInspectionOption
            {...restProps}
            key={template.id}
            isActive={selectedTemplate === template.id}
            icon={template.icon}
            colorCode={template.colorCode}
            description={template.description}
            names={template.names}
            onPress={() => {
              onItemPress(template.id);
            }}
          />
        ))}
      </Row>
    </FormControl>
  );
};

export default FormRatingInspection;
