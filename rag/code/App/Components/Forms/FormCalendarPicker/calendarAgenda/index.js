/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  // getDay,
  format,
  addDays,
  subDays,
  // isToday,
  eachDay,
  isFuture,
  isSameDay,
  endOfWeek,
  getISOWeek,
  startOfWeek,
  differenceInDays,
} from 'date-fns';
import ChineseLocale from 'date-fns/locale/zh_cn';
import { Colors } from '@Themes';
import { Text } from '@Elements';
import { View, FlatList, Dimensions, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';
import Weeks from './Weeks';
const width = Dimensions.get('window').width;
const ITEM_LENGTH = width / 7;
const _today = new Date();
const _year = _today.getFullYear();
const _month = _today.getMonth();
const _day = _today.getDate();
const TODAY = new Date(_year, _month, _day); // FORMAT: Wed May 16 2018 00:00:00 GMT+0800 (CST)

const DateItem = ({ onItemPress, highlight, item }) => {
  const solar = format(item, 'D');
  const highlightBgColor = Colors.primary;
  const normalBgColor = 'transparent';
  const hightlightTextColor = 'black';
  const normalTextColor = Colors.text;
  return (
    <View style={{ width: width / 7, height: 30 }}>
      <TouchableOpacity
        underlayColor="#008b8b"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={onItemPress}
      >
        <View
          style={[
            { borderRadius: 13, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
            { backgroundColor: highlight ? highlightBgColor : normalBgColor },
          ]}
        >
          <Text
            style={[
              { padding: highlight ? 2 : 0, fontSize: 11 },
              { color: highlight ? hightlightTextColor : normalTextColor },
            ]}
          >
            {solar}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

class CalendarStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.getInitialDates(),
      isTodayVisible: true,
      pageOfToday: 2,
      currentPage: 2,
    };
  }

  componentWillMount() {
    const touchThreshold = 50;
    const speedThreshold = 0.2;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > touchThreshold && vy > speedThreshold) {
          const { onSwipeDown } = this.props;
          if (onSwipeDown) {
            onSwipeDown();
          }
        }
        return false;
      },
      onPanResponderRelease: () => {},
    });
  }

  componentDidUpdate(prevProps) {
    const { selectedDate } = this.props;
    if (isSameDay(selectedDate, prevProps.selectedDate)) return;
    const nextSelectedDate = selectedDate;
    if (!this.currentPageDatesIncludes(nextSelectedDate)) {
      const sameDay = (d) => isSameDay(d, nextSelectedDate);
      if (this.state.datas.find(sameDay)) {
        let selectedIndex = this.state.datas.findIndex(sameDay);
        if (selectedIndex === -1) selectedIndex = this.state.pageOfToday; // in case not find
        const selectedPage = ~~(selectedIndex / 7);
        this.scrollToPage(selectedPage);
      } else if (isFuture(nextSelectedDate)) {
        const head = this.state.datas[0];
        const tail = endOfWeek(nextSelectedDate);
        const days = eachDay(head, tail);
        this.setState(
          {
            datas: days,
            isTodayVisible: false,
          },
          () => {
            const page = ~~(days.length / 7 - 1);
            this.scrollToPage(page);
          }
        );
      } else {
        const head = startOfWeek(nextSelectedDate);
        const tail = this.state.datas[this.state.datas.length - 1];
        const days = eachDay(head, tail);
        this.setState(
          {
            datas: days,
            isTodayVisible: false,
          },
          () => {
            this.scrollToPage(0);
          }
        );
      }
    }
  }

  scrollToPage = (page, animated = true) => {
    this._calendar.scrollToIndex({ animated, index: 7 * page });
  };

  currentPageDatesIncludes = (date) => {
    const { currentPage } = this.state;
    const currentPageDates = this.state.datas.slice(7 * currentPage, 7 * (currentPage + 1));
    return !!currentPageDates.find((d) => isSameDay(d, date));
  };

  getInitialDates() {
    const last2WeekOfToday = subDays(TODAY, 7 * 2);
    const next2WeekOfToday = addDays(TODAY, 7 * 2);
    const startLast2Week = startOfWeek(last2WeekOfToday);
    const endNext2Week = endOfWeek(next2WeekOfToday);
    const eachDays = eachDay(startLast2Week, endNext2Week);
    return eachDays;
  }

  loadNextTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const lastDayOfNext2Week = addDays(originalLastDate, 7 * 2);
    const eachDays = eachDay(originalFirstDate, lastDayOfNext2Week);
    this.setState({ datas: eachDays });
  }

  loadPreviousTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const firstDayOfPrevious2Week = subDays(originalFirstDate, 7 * 2);
    const eachDays = eachDay(firstDayOfPrevious2Week, originalLastDate);
    this.setState(
      (prevState) => ({
        datas: eachDays,
        currentPage: prevState.currentPage + 2,
        pageOfToday: prevState.pageOfToday + 2,
      }),
      () => {
        this.scrollToPage(2, false);
      }
    );
  }

  _renderHeader = () => {
    const { selectedDate, onPressGoToday, isChinese, showWeekNumber } = this.props;

    const dateFormatZH = format(selectedDate, 'YYYY/MM/DD [周]dd', { locale: ChineseLocale });
    const dateFormatEn = format(selectedDate, 'YYYY/MM/DD ddd');
    const dateFormatted = isChinese ? dateFormatZH : dateFormatEn;
    const weekNumber = getISOWeek(selectedDate);
    return (
      <View style={styles.header}>
        <Text style={styles.headerDate}>{dateFormatted}</Text>
        {showWeekNumber && <Text style={styles.headerDateWeek}>{` W${weekNumber}`}</Text>}
        {!this.state.isTodayVisible && (
          <TouchableOpacity
            style={styles.headerGoTodayButton}
            onPress={() => {
              const page = this.state.pageOfToday;
              if (onPressGoToday) {
                onPressGoToday(TODAY);
              }
              this.scrollToPage(page);
            }}
          >
            <Text style={styles.todayText}>今</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _stringToDate = (dateString) => {
    const dateArr = dateString.split('-');
    const [y, m, d] = dateArr.map((ds) => parseInt(ds, 10));
    return new Date(y, m - 1, d);
  };

  render() {
    const { markedDate, onPressDate, selectedDate, showChineseLunar, language } = this.props;
    const marked = markedDate.map((ds) => this._stringToDate(ds));
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        {/* {this._renderHeader()} */}
        <Weeks language={language} />
        <FlatList
          ref={(ref) => (this._calendar = ref)}
          bounces={false}
          horizontal
          pagingEnabled
          initialScrollIndex={14}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.momentumEnd}
          scrollEventThrottle={500}
          getItemLayout={(data, index) => ({ length: ITEM_LENGTH, offset: ITEM_LENGTH * index, index })}
          onEndReached={() => {
            this.onEndReached();
          }}
          onEndReachedThreshold={0.01}
          data={this.state.datas}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <DateItem
              item={item}
              showLunar={showChineseLunar}
              onItemPress={() => onPressDate && onPressDate(item)}
              highlight={isSameDay(selectedDate, item)}
              marked={marked.find((d) => isSameDay(d, item))}
            />
          )}
        />
      </View>
    );
  }

  momentumEnd = (event) => {
    const firstDayInCalendar = this.state.datas ? this.state.datas[0] : new Date();
    const daysBeforeToday = differenceInDays(firstDayInCalendar, new Date());
    const pageOfToday = ~~Math.abs(daysBeforeToday / 7);
    const screenWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = event.nativeEvent.contentOffset.x / screenWidth;
    this.setState({
      pageOfToday,
      currentPage,
      isTodayVisible: currentPage === pageOfToday,
    });

    if (event.nativeEvent.contentOffset.x < width) {
      this.loadPreviousTwoWeek(this.state.datas);
    }
  };

  onEndReached() {
    this.loadNextTwoWeek(this.state.datas);
  }
}

CalendarStrip.propTypes = {
  isChinese: PropTypes.bool,
  showWeekNumber: PropTypes.bool,
  showChineseLunar: PropTypes.bool,
};

CalendarStrip.defaultProps = {
  isChinese: false,
  showWeekNumber: false,
  showChineseLunar: false,
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 20 + 50,
  },
  header: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDate: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  headerDateWeek: {
    color: '#000',
    fontSize: 14,
  },
  headerGoTodayButton: {
    borderRadius: 10,
    width: 20,
    height: 20,
    backgroundColor: '#3D6DCF',
    position: 'absolute',
    top: 5,
    right: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 12,
    color: 'white',
  },
  itemView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  itemLunarText: {
    fontSize: 14,
  },
  itemBottomDot: {
    width: 4,
    left: 20,
    height: 4,
    bottom: 4,
    borderRadius: 2,
    position: 'absolute',
  },
});

export default CalendarStrip;
