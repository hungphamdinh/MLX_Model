/* @flow */

import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { StyleSheet, View } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Button, Text, Icon,
} from '../../Elements';
import {
  Colors, Fonts, Metric, ImageResource,
} from '../../Themes';
import I18n from '../../I18n';

type Props = {
  item: Object,
  index: number,
  onPressItem: Function,
  badgeIconName?: string
};

export default class extends React.PureComponent<Props> {
  render() {
    const { item, onPressItem, badgeIconName, onPressDelete, isItem } = this.props;
    const id = get(item, 'id') || '';
    const unitID = get(item, 'fullUnitCode') || '';
    const startDate = get(item, 'startDate') ? moment(get(item, 'startDate')).format('DD/MM/YYYY') : '';
    const creationTime = get(item, 'creationTime') ? moment(get(item, 'creationTime')).format('DD/MM/YYYY') : '';
    const endDate = get(item, 'endDate') ? moment(get(item, 'endDate')).format('DD/MM/YYYY') : '';
    const description = get(item, 'description') || '';
    const priority = get(item, 'priority') || {};
    const status = get(item, 'status') || {};
    const taskInfo = get(item, 'taskStatus') || '';
    const location = get(item, 'location.name') || '';
    const createUser = get(item, 'creatorUser.displayName') || '';
    const teamUser = get(item, 'teamUser.displayName') || '';
    const workId = get(item, 'workOrderId') || false;
    const planId = get(item, 'planId') || false;
    const isShowBadge = (badgeIconName || '').length > 0 && (get(item, 'isQuickCreate') || false);
    const date = [];
    if (startDate) date.push(startDate);
    if (!startDate) date.push(creationTime);
    if (endDate) date.push(endDate);
    return (
        <Button
          onPress={() => onPressItem(isItem ? item : item.id || 'noID')}
          style={[styles.itemContainer, { marginTop: Metric.space10 }]}
        >
            <View style={styles.itemNumber}>
                <View style={styles.itemTextInfoContainer}>
                    <Text
                      color={Colors.textWhite}
                      fontFamily={Fonts.SemiBold}
                    >
                        {`#${id}${workId ? `/${workId}` : planId ? `/${planId}` : ''}`}
                    </Text>
                </View>
                {
            status && (
            <View style={
                [
                  styles.itemTextInfoContainer,
                  {
                    backgroundColor: status.colorCode || taskInfo.colorCode || Colors.bgSemiGray,
                  }]
              }
            >
                <Text color={Colors.textWhite} fontFamily={Fonts.SemiBold}>
                    {status.name || taskInfo.name}
                </Text>
            </View>
            )
          }

                {isShowBadge && (
                <View style={styles.badgeIcon}>
                    <IconMaterial
                      name={badgeIconName || 'lightning-bolt'}
                      size={18}
                      color={Colors.textWhite}
                    />
                </View>
          )}
            </View>

            <View style={{}}>
                {
                    <View style={{ flexDirection: 'row' }}>
                        {!isEmpty(unitID) && (
                        <Text fontFamily={Fonts.Bold} style={{ marginTop: Metric.space5, flex: 1 }}>
                            {unitID}
                        </Text>)}
                        <Text style={{ marginTop: Metric.space5 }} fontFamily={Fonts.Bold}>{`${location}`}</Text>
                    </View>
          }

                <View style={{}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                        <Icon source={ImageResource.IC_Calendar} size={Metric.iconSize15} />
                        <Text color={Colors.textHeather} style={{ marginLeft: Metric.space5, flex: 1 }}>
                            {date.join(' - ')}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source={ImageResource.IC_createBy} style={{ marginRight: 5 }} size={Metric.iconSize15} />
                            <Text style={{}} fontFamily={Fonts.Bold}>{`${teamUser}`}</Text>
                        </View>
                    </View>
                </View>

          <View style={styles.rowCenter}>
            <Icon source={ImageResource.IC_Chat} size={Metric.iconSize15} />
            <Text
              // numberOfLines={1}
              color={Colors.textHeather}
              style={{ marginLeft: Metric.space5, flex: 1 }}
            >
              {description}
            </Text>
            {
              priority && (
              <View style={
                  [
                    styles.itemTextInfoContainer,
                    {
                      backgroundColor: priority.colorCode || Colors.bgSemiGray,
                    }]
                }
              >
                  <Text color={Colors.textWhite} fontFamily={Fonts.SemiBold}>
                      {priority.name}
                  </Text>
              </View>
              )}
                </View>
                {onPressDelete && <View style={styles.buttonDelete}>
                    <Button onPress={() => onPressDelete(item)}>
                        <Text text={I18n.t('AD_COMMON_REMOVE')} />
                    </Button>
                </View>
                }

            </View>
        </Button>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.bgWhite,
    padding: Metric.Space,
    marginHorizontal: Metric.Space,
    borderRadius: Metric.space10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Metric.Space,
  },
  title: {
    flexDirection: 'row',
    marginVertical: Metric.space10,
  },
  itemNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextInfoContainer: {
    backgroundColor: Colors.heather,
    paddingHorizontal: Metric.Space,
    borderRadius: Metric.space5,
  },
  badgeIcon: {
    position: 'absolute',
    top: -20,
    right: -25,
    backgroundColor: '#9e4d4d',
    width: 30,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    shadowRadius: 3,
    shadowColor: '#9e4d4d',
    shadowOpacity: 0.3,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    shadowOffset: {height: 3},
  },
  buttonDelete: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});
