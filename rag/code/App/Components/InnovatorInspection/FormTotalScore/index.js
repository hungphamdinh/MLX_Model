import React, { useMemo } from 'react';
import { Text } from '@Elements';
import I18n from '@I18n';
import { useWatch } from 'react-hook-form';
import { calculateTotalScore } from '../../../Transforms/SurveyTransformer';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Fonts } from '../../../Themes';

function FormTotalScore() {
  const formPages = useWatch({ name: 'formPages' });

  const totalScore = useMemo(() => {
    return calculateTotalScore(formPages);
  }, [formPages]);

  if (totalScore === 0) return null;

  return (
    <Text style={styles.textScore}>
      <Text fontFamily={Fonts.Bold} text={`${I18n.t('FORM_TOTAL_SCORE')}: `} />
      <Text text={LocaleConfig.formatNumber(totalScore)} />
    </Text>
  );
}

const areEqual = () => {
  return true; // Prevent re-render by always returning true
};

export default React.memo(FormTotalScore, areEqual);

const styles = {
  textScore: {
    marginLeft: 15,
  },
};
