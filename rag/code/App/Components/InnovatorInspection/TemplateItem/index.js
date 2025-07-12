/**
 * Created by thienmd on 9/23/20
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, View } from 'react-native';
import Swipeable from 'react-native-swipeable';
import _ from 'lodash';
import I18n from '@I18n';
import styled from 'styled-components/native';
import moment from 'moment';
import styles from './styles';
import Row from '../../Grid/Row';
import { StatusView, Text } from '../../../Elements';
import RightButtons from '../../Lists/RightButtons';
import {
  FormStatusCode,
  FormTypes,
  INSPECTION_FORM_TYPE,
  InspectionFormTypes,
  TemplateTypes,
} from '../../../Config/Constants';
import { generateGUID } from '../../../Utils/number';
import { Wrapper } from '../../ItemApp/ItemCommon';
import Tag from '../../Tag';
import { useTeamForm } from './useTeamForm';
import LocaleConfig from '../../../Config/LocaleConfig';
import { NextIcon } from '../../../Elements/statusView';
import { isGranted } from '../../../Config/PermissionConfig';
import useFeatureFlag from '../../../Context/useFeatureFlag';
import useTeam from '../../../Context/Team/Hooks/UseTeam';

const Value = styled(Text)`
  margin-bottom: 10px;
`;

const Label = ({ text }) => <Value text={`${I18n.t(text)}:`} />;

const TeamWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const TemplateItem = (props) => {
  const {
    formName,
    questionCount,
    team,
    category,
    creatorUserName,
    status,
    publishCount,
    onItemPress,
    onEditPress,
    onRemovePress,
    onClonePress,
    onSetGlobalPress,
    isTeamLeader,
    onPublicPress,
    onPublishToTeamPress,
    isSelect,
    formType,
    creationTime,
    isReadOnly,
    type,
    inspectionPropertyName,
  } = props;
  const [swipeRef, setSwipeRef] = React.useState(null);
  const { isMyForm, isTeamLead } = useTeamForm(props);
  const { isEnableLiveThere } = useFeatureFlag();
  const {
    team: { inspectionTeams },
  } = useTeam();

  const allowAccessForm = !isReadOnly;
  const allowUpdateForm = isGranted('Form.Update');
  const allowDeleteForm = isGranted('Form.Delete');
  const statusCode = _.get(status, 'code');
  const recenter = () => {
    if (swipeRef) {
      swipeRef.recenter();
    }
  };

  const showRemoveAlert = () => {
    Alert.alert(I18n.t('FORM_DELETE_FORM'), I18n.t('FORM_DELETE_FORM_ASK'), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: onRemovePress,
      },
    ]);
  };

  const showMarkGlobalAlert = () => {
    Alert.alert(I18n.t('FORM_MARK_GLOBAL'), I18n.t('FORM_MARK_GLOBAL_CONFIRM'), [
      {
        text: I18n.t('AD_COMMON_NO'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: () => onSetGlobalPress(true),
      },
    ]);
  };

  const btClone = {
    title: I18n.t('FORM_CLONE'),
    color: '#2d61d3',
    icon: 'copy-outline',
    onPress: onClonePress,
  };
  const btRemove = {
    title: I18n.t('AD_COMMON_REMOVE'),
    color: 'red',
    icon: 'trash-outline',
    onPress: showRemoveAlert,
  };

  const btPublic = {
    title: I18n.t('FORM_PUBLISH'),
    color: '#2d61d3',
    icon: 'cloud-upload-outline',
    onPress: () => onPublicPress(true),
  };

  const btUnPublic = {
    title: I18n.t('FORM_UN_PUBLISH'),
    color: 'red',
    icon: 'cloud-download-outline',
    onPress: () => onPublicPress(false),
  };

  const btPublicToTeamForm = {
    title: I18n.t('FORM_MARK_TEAM_FORM'),
    color: '#2d61d3',
    icon: 'people-outline',
    onPress: () => onPublishToTeamPress(true),
  };

  const btUnPublicToTeamForm = {
    title: I18n.t('FORM_UNMARK_TEAM_FORM'),
    color: 'red',
    icon: 'person-remove-outline',
    onPress: () => onPublishToTeamPress(false),
  };

  const btMarkGlobal = {
    title: I18n.t('FORM_MARK_GLOBAL'),
    color: '#2d61d3',
    icon: 'ios-globe',
    onPress: showMarkGlobalAlert,
  };

  const btUnMarkGlobal = {
    title: I18n.t('FORM_UNMARK_GLOBAL'),
    color: 'red',
    icon: 'ios-globe',
    onPress: () => onSetGlobalPress(false),
  };

  const btEdit = {
    title: I18n.t('AD_COMMON_EDIT'),
    icon: 'create-outline',
    color: '#2d61d3',
    onPress: onEditPress,
  };

  const buttons = [];
  const publishedStatus = statusCode === FormStatusCode.PUBLIC || statusCode === FormStatusCode.READ_ONLY;

  const addMarkGlobal = () => {
    btMarkGlobal.disabled = publishCount > 0 || statusCode === FormStatusCode.READ_ONLY;
    buttons.push(btMarkGlobal);
  };

  const canMarkTeamForm = () => {
    const publishTeamIds = _.map(team, (item) => item.id);
    const unpublishedTeams = inspectionTeams.filter((item) => publishTeamIds.indexOf(item.id) < 0);
    return (isMyForm || isTeamLeader) && publishedStatus && _.size(unpublishedTeams) > 0;
  };

  if (allowUpdateForm) {
    if (formType === FormTypes.MY_FORM) {
      if (canMarkTeamForm()) {
        buttons.push(btPublicToTeamForm);
      }
    }
    if (formType === FormTypes.TEAM_FORM && (isMyForm || isTeamLead)) {
      buttons.push(btUnPublicToTeamForm);
    }
    if (isTeamLeader) {
      // for team lead
      if (formType === FormTypes.MY_FORM) {
        if (publishedStatus) {
          addMarkGlobal();
          buttons.push(btUnPublic);
        }
        if (statusCode === FormStatusCode.UN_PUBLIC) {
          buttons.push(btPublic);
        }
      }

      if (formType === FormTypes.GLOBAL_FORM && isMyForm) {
        buttons.push(btUnMarkGlobal);
      }
    } else if (formType === FormTypes.MY_FORM) {
      // for normal user
      if (statusCode === FormStatusCode.PUBLIC) {
        buttons.push(btUnPublic);
      }

      if (statusCode === FormStatusCode.UN_PUBLIC) {
        buttons.push(btPublic);
      }
    }

    if (formType === FormTypes.MY_FORM) {
      buttons.push(btEdit);
    }
  }

  if (allowDeleteForm && statusCode === FormStatusCode.UN_PUBLIC) {
    buttons.push(btRemove);
  }

  if (allowAccessForm) {
    buttons.push(btClone);
  }

  const splitButtons = _.size(buttons) > 3 ? _.chunk(buttons, 3) : [buttons];
  const rightButtons = splitButtons.map((arr) => (
    <RightButtons key={generateGUID()} onPress={recenter} buttons={arr} />
  ));

  const getFormType = () => {
    if (isMyForm) {
      return TemplateTypes.myForm;
    }
    if (formType === FormTypes.GLOBAL_FORM) {
      return TemplateTypes.globalForm;
    }
    return TemplateTypes.teamForm;
  };

  const subStatusOption = useMemo(() => {
    if (formType === FormTypes.MY_FORM) {
      return status;
    }
    if (isEnableLiveThere && formType === FormTypes.GLOBAL_FORM) {
      if (type === INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST) {
        return InspectionFormTypes.inventoryReport;
      }
      return InspectionFormTypes.inspection;
    }
  }, [formType, type]);

  const SwipeableWrapper = isSelect ? View : Swipeable;

  return (
    <SwipeableWrapper
      rightButtonWidth={140}
      rightButtons={rightButtons}
      onRef={(c) => {
        setSwipeRef(c);
      }}
    >
      <Wrapper onPress={onItemPress} style={styles.container}>
        <Row style={styles.rowContainer}>
          <View style={styles.infoContainer}>
            <Row>
              <Value preset="medium" text={formName} bold style={styles.formName} numberOfLines={2} />
              {isReadOnly ? (
                <Tag
                  textStyle={styles.tagLabel}
                  preset="bold"
                  containerStyle={styles.tag}
                  title="FORM_NON_EDITABLE_FORM"
                />
              ) : (
                <NextIcon />
              )}
            </Row>
            <LabelView label="FORM_CATEGORY" text={category?.name} />
            {isEnableLiveThere && _.size(inspectionPropertyName) > 0 && (
              <LabelView label="FORM_PROPERTY_NAME" text={inspectionPropertyName} />
            )}

            <LabelView label="FORM_NUMBER_OF_QUESTIONS" text={questionCount} />
            <LabelView label="COMMON_CREATED_BY" text={creatorUserName} />
            <LabelView label="COMMON_CREATED_DATE" text={moment(creationTime).format(LocaleConfig.dateTimeFormat)} />

            {_.size(team) > 0 && (isMyForm || isTeamLeader) && (
              <TeamWrapper>
                {team.map((member) => (
                  <Tag title={member.name} key={member.id} containerStyle={{ marginBottom: 10 }} />
                ))}
              </TeamWrapper>
            )}

            <StatusView status={getFormType()} subStatus={subStatusOption} hideNextIcon />
          </View>
        </Row>
      </Wrapper>
    </SwipeableWrapper>
  );
};

export default TemplateItem;

TemplateItem.propTypes = {
  questionCount: PropTypes.number,
  formName: PropTypes.string,
  onItemPress: PropTypes.func,
  isSelect: PropTypes.bool,
};

TemplateItem.defaultProps = {
  questionCount: 0,
  formName: '',
  isSelect: false,
  onItemPress: () => {},
};

const LabelView = ({ label, text }) => (
  <>
    {_.size(text) > 0 && (
      <View style={styles.labelValueContainer}>
        <Label text={label} />
        <Value preset="medium" text={text} />
      </View>
    )}
  </>
);
