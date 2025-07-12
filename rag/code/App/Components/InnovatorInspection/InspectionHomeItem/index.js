/**
 * Created by thienmd on 9/23/20
 */
import React, { Fragment } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import NavigationService from '@NavigationService';
import PropTypes from 'prop-types';
import _ from 'lodash';
import I18n from '@I18n';
import styles from './styles';
import Row from '../../Grid/Row';
import { ImageResource } from '../../../Themes';
import { ImageView, Text, Linkages } from '../../../Elements';
import { isGranted } from '../../../Config/PermissionConfig';
import { icons } from '../../../Resources/icon';
import useUser from '../../../Context/User/Hooks/UseUser';
import { formatDate } from '../../../Utils/transformData';
import { HorizontalLine } from '../../ItemApp/ItemCommon';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import useFeatureFlag from '../../../Context/useFeatureFlag';
import { INSPECTION_FORM_TYPE } from '../../../Config/Constants';

const ActionButton = ({ onPress, title, isSyncing }) => (
  <TouchableOpacity
    disabled={isSyncing}
    style={[styles.actionButton, isSyncing && styles.disabledButton]}
    onPress={onPress}
  >
    <Text text={title} style={styles.actionButtonTitle} />
  </TouchableOpacity>
);

const InspectionTag = ({ title, color = '#5F92CC' }) => (
  <View style={[styles.inspectionTag, { backgroundColor: color }]}>
    <Text preset="medium" style={styles.tagTitle} numberOfLines={1} text={title} />
  </View>
);

function checkIsTeamAssignment(teamOfJob, key = 'members', user) {
  let isTeamAssignment = false;
  if (teamOfJob.length > 0) {
    teamOfJob[0][key].forEach((item) => {
      if (item.id === user?.id) {
        isTeamAssignment = true;
      }
    });
  }
  return isTeamAssignment;
}

const InspectionHomeItem = ({
  inspection,
  subject,
  status,
  onItemPress,
  onViewReport,
  onPickUpPress,
  vertical,
  onRemovePress,
  startDate,
  pickedByUserId,
  isOnline,
  creatorUserId,
  listAssigneeIds = [],
  inspectionTeams = [],
  data,
  form,
}) => {
  const {
    user: { user },
  } = useUser();
  const { isEnableLiveThere } = useFeatureFlag();

  const {
    sync: { unSyncDataInspections },
  } = useSync();

  const property = _.get(inspection, 'property') || {};
  const { name, image } = property;

  const isWorkFlowClosed = _.get(status, 'isIssueClosed');
  const isWorkflowDefault = _.get(status, 'isDefault');
  const isWorkflowProgress = !isWorkFlowClosed && !isWorkflowDefault;

  const isAssignee = listAssigneeIds.findIndex((item) => item === user?.id) > -1;
  const isCreatorJob = user?.id === creatorUserId;

  // Check team assignment
  let teamOfJob = [];
  if (inspectionTeams.length > 0 && inspection?.team) {
    teamOfJob = inspectionTeams.filter((item) => item.id === inspection?.team.id);
  }

  const jobIsPicked = pickedByUserId || !isOnline;

  const isTeamAssignment =
    checkIsTeamAssignment(teamOfJob, 'members', user) || checkIsTeamAssignment(teamOfJob, 'leaders', user);

  const isAllowPickUp = !jobIsPicked && (isAssignee || isCreatorJob || isTeamAssignment) && !isWorkFlowClosed;

  const isAllowRelease = !isOnline || pickedByUserId === user?.id;
  const isTeamJob = !isCreatorJob;
  const isExecuting = jobIsPicked && !isWorkFlowClosed;

  // const allowPickUp = (isWorkflowProgress || isWorkflowDefault) && !locked;
  const statusIcon = isWorkflowProgress ? icons.inProgressIcon : isWorkFlowClosed ? ImageResource.IC_SUCCESS : null;
  const isInventoryCheckList = form?.type === INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST;
  const formTypeTag = {
    title: isInventoryCheckList ? 'FORM_TYPE_INVENTORY_CHECKLIST' : 'FORM_TYPE_INPECTION',
    color: isInventoryCheckList ? '#2D6553' : '#5F92CC',
  };

  const onLinkageItemPress = (item) => {
    NavigationService.navigate('editJobRequest', {
      id: item.id,
    });
  };
  const showRemoveAlert = () => {
    Alert.alert(I18n.t('INSPECTION_DELETE_INSPECTION'), I18n.t('INSPECTION_DELETE_ASK'), [
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

  const getSyncingItem = () => unSyncDataInspections.data.findIndex((item) => item.guid === data.guid) > -1;

  const width = vertical ? undefined : 230;
  const marginRight = vertical ? 16 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { width, marginRight }]}
      onPress={() => onItemPress(data)}
      onLongPress={isWorkflowDefault && isGranted('Inspection.Delete') ? showRemoveAlert : undefined}
    >
      <ImageView source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.tagWrapper}>
        <InspectionTag title={!isTeamJob ? I18n.t('INSPECTION_MY_JOB') : I18n.t('INSPECTION_TEAM_JOB')} />
        {isExecuting && <InspectionTag title="INSPECTION_EXECUTING" color="orange" />}
        {isEnableLiveThere && <InspectionTag {...formTypeTag} />}
      </View>

      <View>
        <Row style={styles.header}>
          <Text numberOfLines={1}>{`#${inspection?.remoteId}`}</Text>
          {_.size(startDate) > 0 && <Text numberOfLines={1}>{formatDate(startDate)}</Text>}
        </Row>
        <HorizontalLine />
        <Text style={styles.subject} numberOfLines={1}>
          {subject}
        </Text>

        <Row center style={styles.propertyNameContainer}>
          <Image source={ImageResource.IMG_INSPECTION_PROPERTY} style={styles.building} resizeMode="contain" />
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
        </Row>
      </View>
      <Row center style={styles.actionContainer}>
        {isAllowPickUp && <ActionButton title="INSPECTION_PICK_UP" onPress={() => onPickUpPress(false)} />}
        {isAllowRelease && (
          <ActionButton isSyncing={getSyncingItem()} title="INSPECTION_RELEASE" onPress={() => onPickUpPress(true)} />
        )}
        {isWorkFlowClosed && <ActionButton title="INSPECTION_VIEW_REPORT" onPress={onViewReport} />}
      </Row>
      {!isWorkflowDefault && <Image source={statusIcon} style={styles.statusIcon} />}
      {inspection.workOrderId && (
        <Linkages
          text="JR_LINKAGE"
          style={styles.linkageWrapper}
          onPress={onLinkageItemPress}
          linkages={[{ id: inspection.workOrderId }]}
        />
      )}
    </TouchableOpacity>
  );
};
export default React.memo(InspectionHomeItem);

InspectionHomeItem.propTypes = {
  onItemPress: PropTypes.func,
};

InspectionHomeItem.defaultProps = {
  id: 0,
  onItemPress: () => {},
};
