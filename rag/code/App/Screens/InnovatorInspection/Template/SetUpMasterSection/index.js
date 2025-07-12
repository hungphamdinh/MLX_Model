import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import styled from 'styled-components';
import { IconButton, Text } from '@Elements';
import BaseLayout from '@Components/Layout/BaseLayout';
import I18n from '@I18n';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';
import { FormProvider, useFieldArray } from 'react-hook-form';
import Row from '@Components/Grid/Row';
import { Colors } from '@Themes';
import {
  convertFormPageGroupsToFormPages,
  transformFormPageGroupToDB,
  transformFormPageGroupParams,
} from '@Transforms/FormTransformer';
import Sections from './Sections';

const SectionTitle = styled(Text)`
  font-size: 16px;
`;

const Header = styled(Row)``;

const SetUpMasterSection = ({ navigation }) => {
  const formPages = navigation.getParam('formPages');
  const onComplete = navigation.getParam('onComplete');
  const formPageGroups = navigation.getParam('formPageGroups');
  const formData = navigation.getParam('formData');
  const routeName = _.get(navigation, 'state.routeName');
  const fromInspection = routeName === 'setUpMasterSectionInspection';

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
  });

  const getInitialValues = () => {
    if (!formPageGroups) {
      return {};
    }
    return {
      masterSections: formPageGroups.map((item) => {
        if (_.size(item.formPages)) {
          item.formPages = formPages.filter((page) => {
            const formPage = item.formPages.find((child) => child.id === page.id);
            return formPage;
          });
        }
        return item;
      }),
    };
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: getInitialValues(),
  });

  const { control } = formMethods;
  const { fields: masterSections, remove, insert, update } = useFieldArray({
    control,
    name: 'masterSections',
    keyName: 'id',
  });

  const onSaveSections = () => {
    const transform = fromInspection ? transformFormPageGroupToDB : transformFormPageGroupParams;
    const formPagesWithGroups = convertFormPageGroupsToFormPages(formPages, masterSections);
    const formPageGroupsTransform = transform(masterSections, formData);

    onComplete({
      formPages: formPagesWithGroups,
      formPageGroups: formPageGroupsTransform,
    });
    navigation.goBack();
  };

  const updateField = (idx, values) => {
    update(idx, {
      ...masterSections[idx],
      ...values,
    });
  };

  const onAddSection = () => {
    insert(_.size(masterSections) + 1, {
      name: I18n.t('INSPECTION_MASTER_SECTION_TITLE', undefined, _.size(masterSections) + 1),
      formPages: [],
    });
  };

  const onRemoveSection = (index) => {
    remove(index);
  };

  const mainLayoutProps = {
    title: I18n.t('INSPECTION_SET_UP_MASTER_SECTION'),
    padding: true,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        onPress: onSaveSections,
      },
    ],
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <Header center>
          <SectionTitle preset="bold" text="INSPECTION_MASTER_SECTION" />
          <IconButton
            testID="addSectionButton"
            onPress={onAddSection}
            name="add-circle"
            size={20}
            color={Colors.azure}
          />
        </Header>
        <Sections
          name="masterSections"
          onRemoveSection={onRemoveSection}
          list={masterSections}
          updateField={updateField}
          formPages={formPages}
        />
      </FormProvider>
    </BaseLayout>
  );
};

export default SetUpMasterSection;
