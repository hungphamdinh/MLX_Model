/**
 * Created by thienmd on 9/23/20
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import I18n from '@I18n';
import _ from 'lodash';
import styles from './styles';
import Row from '../../Grid/Row';
import InfoItem, { DateInfoItem } from '../../ListItem/InfoItem';
import SyncStatus from '../Sync/SyncStatus';
import { Wrapper } from '../../ItemApp/ItemCommon';
import { modal } from '../../../Utils';

const InspectionItem = ({
  subject,
  inspection,
  creationTime,
  onItemPress,
  syncState,
  status,
  hideSync,
  workflow,
  inspectionProperty,
  unSyncItem,
}) => {
  const address = _.get(inspection, 'property.address');

  const statusDisplay = status || workflow.status;
  const subjectDisplay = subject || workflow?.subject;
  const propertyDisplay = _.get(inspection, 'property.name') || inspectionProperty?.name;
  // return  null
  const onInspectionPress = () => {
    if (!_.get(inspection, 'property.isActive') && !inspectionProperty) {
      modal.showError(I18n.t('INSPECTION_PROPERTY_INACTIVE_MESS'));
      return;
    }
    onItemPress();
  };
  return (
    <Wrapper onPress={onInspectionPress} testID="inspection-item">
      <View style={styles.infoContainer}>
        <Row style={styles.syncContainer}>
          <InfoItem text={subjectDisplay} bold />
          {!hideSync && <SyncStatus state={syncState} />}
        </Row>
        {_.size(propertyDisplay) > 0 && <InfoItem text={propertyDisplay} />}
        {_.size(address) > 0 && <InfoItem text={address} />}

        <InfoItem unSyncItem={unSyncItem} text={_.get(statusDisplay, 'name')} color={_.get(statusDisplay, 'colorCode', '#000000')} />
        <DateInfoItem date={creationTime} />
      </View>
    </Wrapper>
  );
};

export default React.memo(InspectionItem);

InspectionItem.propTypes = {
  onItemPress: PropTypes.func,
};

InspectionItem.defaultProps = {
  onItemPress: () => {},
};
