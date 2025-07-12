import { Text, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';

import React from 'react';
import { RatingInspectionOption } from '../../../../../Forms/FormRatingInspection';
import styles from './styles';
import useForm from '../../../../../../Context/Form/Hooks/UseForm';
import { generateInspectionUUID, TableNames } from '../../../../../../Services/OfflineDB/IDGenerator';

// const optionAnswerTemplates = {
//   QuestionYesNo: [
//     {
//       guid: 'f14b97e4-f6c6-4bb4-bec9-3f9e7a32b3ef',
//       groupCode: 'QuestionYesNo',
//       icon: 'check',
//       colorCode: '#a8e5eb',
//       description: 'Yes',
//       id: 2,
//     },
//     {
//       guid: '58128043-b6d0-4185-9474-4ad1e666171d',
//       groupCode: 'QuestionYesNo',
//       icon: 'close',
//       colorCode: '#e59ea9',
//       description: 'No',
//       id: 3,
//     },
//   ],
//   QuestionGNP: [
//     {
//       guid: '7acd3005-35b2-4340-9487-ed54154834c9',
//       groupCode: 'QuestionGNP',
//       icon: 'check',
//       colorCode: '#a8e5eb',
//       description: 'Good',
//       id: 4,
//     },
//     {
//       guid: '90a3513e-8917-4595-9e82-5fa7732ecfa0',
//       groupCode: 'QuestionGNP',
//       icon: 'star',
//       colorCode: '#8cd7bc',
//       description: 'Normal',
//       id: 5,
//     },
//     {
//       guid: 'a27dbe84-5e96-44e5-9f76-4472939df863',
//       groupCode: 'QuestionGNP',
//       icon: 'close',
//       colorCode: '#e59ea9',
//       description: 'Poor',
//       id: 6,
//     },
//   ],
//   QuestionAgree: [
//     {
//       guid: '72e4753a-8be4-4565-8c67-fe5e9b93e863',
//       groupCode: 'QuestionAgree',
//       icon: 'check',
//       colorCode: '#a8e5eb',
//       description: 'Agree',
//       id: 7,
//     },
//     {
//       guid: 'b6bcddae-9601-4af4-8f1a-156a59e36ea4',
//       groupCode: 'QuestionAgree',
//       icon: 'close',
//       colorCode: '#e59ea9',
//       description: 'Disagree',
//       id: 8,
//     },
//   ],
// };

const RatingOptionView = ({ setFieldValue, groupCode }) => {
  const {
    form: { optionAnswerTemplates },
  } = useForm();
  const keys = _.keys(optionAnswerTemplates);

  React.useEffect(() => {
    if (_.size(groupCode) === 0) {
      onItemPress(_.first(keys));
    }

    // setFieldValue('groupCode', _.first(_.keys(optionAnswerTemplates)));
    // setFieldValue('answers', _.first(_.keys(optionAnswerTemplates)));
  }, []);

  const onItemPress = (newGroupCode) => {
    const options = newGroupCode ? _.get(optionAnswerTemplates, newGroupCode) : [];
    const answers = options.map((item) => {
      const id = generateInspectionUUID(TableNames.formUserAnswerQuestionOption);
      return {
        formQuestionAnswerTemplateId: item.id,
        label: item.description,
        value: id,
        id,
        description: '',
        isAddNew: true,
      };
    });
    setFieldValue('answers', answers);
    setFieldValue('groupCode', newGroupCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('INSPECTION_CHOOSE_OPTION_TYPE')}</Text>
      {keys.map((key) => (
        <TouchableOpacity
          key={key}
          style={[styles.row, groupCode === key ? styles.active : null]}
          onPress={() => onItemPress(key)}
        >
          {optionAnswerTemplates[key].map((item) => (
            <RatingInspectionOption disabled key={`${item.id}`} {...item} />
          ))}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingOptionView;
