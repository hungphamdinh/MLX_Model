/**
 * Created by thienmd on 11/13/20
 */

import React from 'react';
import {View} from 'react-native';
import _ from 'lodash';
import {Colors, Metric} from '../../../Themes';
import {ItemWrapper} from '../../../Elements';
import {PlaceHolder} from '../../index';

const ListPlaceholder = ({isItem}) => (
    <View style={{marginTop: 0}}>
        <View style={{height: Metric.Space}} />
        {
      _.range(0, isItem ? 1 : 5).map(item => (
          <ItemWrapper key={`${item}`}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{backgroundColor: Colors.heather, paddingHorizontal: Metric.Space, borderRadius: 5}}>
                      <View style={{height: Metric.space10}} />
                  </View>
                  <View style={{backgroundColor: Colors.heather, paddingHorizontal: Metric.Space, borderRadius: 5}}>
                      <View style={{height: Metric.space10}} />
                  </View>
              </View>

              <View style={{}}>
                  <PlaceHolder width={70} style={{marginTop: Metric.space5}} />
                  <View style={{flexDirection: 'row', marginVertical: Metric.space10}}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <PlaceHolder width={90} />
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: Metric.Space}}>
                          <PlaceHolder width={Metric.space60} />
                      </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <PlaceHolder width={280} />
                  </View>
              </View>
          </ItemWrapper>
      ))
    }
    </View>
);

export default ListPlaceholder;
