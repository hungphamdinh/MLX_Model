import moment from 'moment';
import LocaleConfig from '../Config/LocaleConfig';
// import store from "@stores/store";
// import Config from "@utils/configs";

export default class {
  static convertNumber(x) {
    if (x === undefined) {
      x = 0;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  static measureLayoutView = (event: Object) => {
    if (!event) return;
    const height = event.nativeEvent.layout.height || 0;
    const width = event.nativeEvent.layout.width || 0;
    const y = event.nativeEvent.layout.y || 0;
    const x = event.nativeEvent.layout.x || 0;
    return {
      height,
      width,
      x,
      y,
    };
  };

  static stringToISOString = (d: string) => {
    const date = new Date(moment(d));
    return d ? date.toISOString() : undefined;
  };

  static convertEndDate = (d: string) => {
    const date = new Date(moment(d));
    date.setDate(date.getDate() + 1);
    const newDate = new Date(date);
    const a = new Date(newDate - 1);
    return a.toISOString();
  };
}

export const transformDateToFormSubmit = (date) => {
  if (!date) return undefined;
  return moment(date).toISOString();
};

export const getDefaultFromToDateForReport = () => {
  const beginLastMonth = moment().subtract(1, 'months').startOf('month').toDate();
  const endOfThisMonth = moment().endOf('month').toDate();
  return {
    fromDate: beginLastMonth,
    toDate: endOfThisMonth,
  };
};

export const getTime = (date) => {
  const strTime = moment(date).format(`${LocaleConfig.timeFormat}`);
  return `${strTime}`;
};

export const getDate = (date) => {
  const strDate = moment(date).format(`${LocaleConfig.dateTimeFormat}`);
  return `${strDate}`;
};

export function minutesToDays(minutes) {
  return Math.floor(minutes / (24 * 60));
}

export function daysToMinutes(days) {
  return days * 24 * 60;
}

export function getIsoDateRange(start, end) {
  let fromDate;
  let toDate;
  // Validate input dates
  if (start && end) {
    if (moment(start).isValid()) {
      fromDate = moment(start).startOf('day').toJSON();
    }

    if (moment(end).isValid()) {
      toDate = moment(end).endOf('day').toJSON();
    }

    // Ensure end date is not before start date
    if (moment(end).isBefore(start)) {
      throw new Error('End date cannot be before start date');
    }
  }

  return { fromDate, toDate };
}

export const getDefaultDateRange = () => {
  const date = new Date();
  return {
    fromDate: new Date(date.getFullYear(), date.getMonth(), 1),
    toDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};
