import React from 'react';
import _ from 'lodash';
import { Group, ImageView, Text } from '@Elements';
import { Image, ScrollView, View } from 'react-native';
import I18n from '@I18n';
import withModal from '@HOC/ModalHOC';

import { formatDate } from '../../../Utils/transformData';
import styles from './styles';
import Row from '../../Grid/Row';
import { ImageResource } from '../../../Themes';
import Tag from '../../Tag';

const GroupWithSeparator = (props) => (
  <>
    <View style={styles.separator} />
    <Group {...props} />
  </>
);

const LabelValue = ({ label, value, contentStyle, marginTop = true, multiline = false }) => (
  <>
    {value ? (
      <Row style={[{ marginTop: marginTop ? 10 : 0 }]}>
        <Text numberOfLines={1} style={styles.label}>
          {I18n.t(label)}:
        </Text>
        <Text numberOfLines={multiline ? 0 : 1} style={[styles.value, contentStyle]} color="black">
          {value}
        </Text>
      </Row>
    ) : null}
  </>
);

export const PropertyInfoView = ({ propertyDetail }) => {
  if (!propertyDetail) {
    return null;
  }

  const users = _.get(propertyDetail, 'users', []);
  const lastModifierUserName = propertyDetail.lastModifierUser ? `${propertyDetail.lastModifierUser.displayName}/ ` : '';
  const lastModifierDate = propertyDetail.lastModificationTime ? formatDate(propertyDetail.lastModificationTime) : '';
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
      <View style={styles.topContainer}>
        <View style={styles.propertyContainer}>
          <ImageView source={propertyDetail.image} style={styles.propertyImage} />
          <View style={styles.informationContainer}>
            <Row center>
              <Image source={ImageResource.IMG_INSPECTION_PROPERTY} style={styles.building} resizeMode="contain" />
              <Text style={styles.title}>{propertyDetail.name}</Text>
            </Row>
            <Text style={styles.type}>{_.get(propertyDetail, 'propertyType.name')}</Text>
          </View>

          {_.size(propertyDetail) > 0 && (
            <GroupWithSeparator title={I18n.t('COMMON_DETAILS')}>
              <LabelValue marginTop={false} label="PROPERTY_UNIT_NAME" value={propertyDetail.unitNumber} />
              <LabelValue
                label="PROPERTY_UNIT_TYPE"
                value={propertyDetail.propertyUnitType ? propertyDetail.propertyUnitType.name : ''}
              />
              <LabelValue contentStyle={styles.contentWithLongLabel} label="PROPERTY_POSTAL CODE" value={propertyDetail.postalCode} />
              <LabelValue label="COMMON_FLOOR" value={propertyDetail.floor} />
              <LabelValue label="COMMON_STREET" value={propertyDetail.street} />
              <LabelValue label="COMMON_BUILDING" value={propertyDetail.building} />
              <LabelValue
                label="PROPERTY_BUILDING_TYPE"
                value={propertyDetail.propertyBuildingType ? propertyDetail.propertyBuildingType.name : ''}
              />
              <LabelValue label="COMMON_DISTRICT" value={propertyDetail.district} />
              <LabelValue label="COMMON_CITY" value={propertyDetail.city} />
              <LabelValue contentStyle={styles.contentWithLongLabel} multiline label="PROPERTY_FULL_ADDRESS" value={propertyDetail.address} />
              <LabelValue contentStyle={styles.contentWithLongLabel} label="PROPERTY_LAST_MODIFIED" value={`${lastModifierUserName}${lastModifierDate}`} />
              <LabelValue label="AD_COMMON_NOTES" value={propertyDetail.notes} />
            </GroupWithSeparator>
          )}
          {_.size(users) > 0 && (
            <GroupWithSeparator title={I18n.t('INSPECTION_ASSIGNEES')}>
              <Row style={styles.memberSections}>
                {users.map((member) => (
                  <Tag title={member.displayName} key={member.id} containerStyle={styles.memberTag} />
                ))}
              </Row>
            </GroupWithSeparator>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const PropertyInfoModal = ({ propertyDetail }) => (
  <View style={styles.propertyInfoModal}>
    <PropertyInfoView propertyDetail={propertyDetail} />
  </View>
);

export default withModal(PropertyInfoModal, 'INSPECTION_PROPERTY_INFORMATION', { padding: 0 });
