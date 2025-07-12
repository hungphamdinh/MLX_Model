import React, { useState } from 'react';
import { Button, Card, Text } from '@Elements';
import styled from 'styled-components/native';
import NavigationService from '@NavigationService';
import I18n from '@I18n';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import { CheckBox } from '../../../Components/Forms/FormCheckBox';
import useApp from '../../../Context/App/Hooks/UseApp';
import useUser from '../../../Context/User/Hooks/UseUser';

const CardWrapper = styled(Card)`
  padding-horizontal: 18px;
  padding-vertical: 32px;
`;

const Title = styled(Text)`
  text-align: center;
  margin-top: 26px;
  margin-bottom: 13px;
`;

const ChangeLanguage = () => {
  const {
    app: { languageId },
    setLangId,
  } = useApp();
  const { getCurrentInformation } = useUser();

  const [selectedLang, setSelectedLang] = useState(languageId);
  const onConfirm = async () => {
    setLangId(selectedLang);
    getCurrentInformation();
    NavigationService.goBack();
  };

  const onLanguageChange = (item) => {
    setSelectedLang(item.id);
  };

  return (
    <BaseLayout title="ST_LANGUAGE">
      <Title text="CHANGE_LANG_TITLE" typo="H1" />
      <CardWrapper>
        {I18n.languages.map((item) => (
          <CheckBox
            key={item.id}
            checkboxType="circle"
            value={item.id === selectedLang}
            label={item.title}
            labelStyle={{ flex: 1, fontSize: 14 }}
            onCheckBoxPress={() => onLanguageChange(item)}
          />
        ))}

        <Button title="COMMON_CONFIRM" primary rounded onPress={onConfirm} containerStyle={{ marginTop: 60 }} />
      </CardWrapper>
    </BaseLayout>
  );
};

export default ChangeLanguage;
