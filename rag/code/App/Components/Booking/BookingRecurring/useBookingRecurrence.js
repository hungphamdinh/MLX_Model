import moment from 'moment';
import { Repeat } from '@Config/Constants';

const getDatesWithInterval = (start, end, interval) => {
  const step = parseInt(interval, 10);
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + step);
  }
  return dates;
};

const generateDatesInMonths = (start, end, dayOfMonth, months) => {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = cur.getMonth();
    let monthDate;
    if (dayOfMonth === 'L') monthDate = new Date(y, m + 1, 0); // last calendar day
    else {
      // check day exist in month
      const last = new Date(y, m + 1, 0).getDate();
      if (dayOfMonth <= last) monthDate = new Date(y, m, dayOfMonth);
    }
    // monthDate in Date Range
    if (monthDate && monthDate >= start && monthDate <= end) dates.push(monthDate);
    cur.setMonth(cur.getMonth() + months);
  }
  return dates;
};

const generateWeekDays = (start, end, dayOfWeeks) => {
  const dates = [];
  const cur = new Date(start);
  const dayOfWeekIds = dayOfWeeks.map((d) => d.id);
  while (cur <= end) {
    // Day selection matching in the date range
    if (dayOfWeekIds.includes(cur.getDay() + 1)) dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

const copyTime = (sourceIso, targetDate) => {
  // date part in YYYY-MM-DD
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;
  // time part from source ISO string
  const timePart = String(sourceIso).split('T')[1];
  return `${datePart}T${timePart}`;
};

// Return the date of the last occurrence of `weekday` in a given month
function getLastWeekdayOfMonth(year, month, weekday) {
  const lastOfMonth = new Date(year, month + 1, 0);
  // E.g., lastOfMonth.getDay()=6 (Sat), weekday=1 (Mon): (6 - 1 + 7) % 7 = 5 ⇒ 31 - 5 = 26 (Last Monday)
  const diff = (lastOfMonth.getDay() - weekday + 7) % 7;
  return new Date(year, month, lastOfMonth.getDate() - diff);
}

// Return the nth occurrence of `weekday` in a given month - Eg: 2nd Tuesday of June 2025
function getNthWeekdayOfMonth(year, month, weekday, n) {
  // gives 0–6 for Sun–Sat on day 1 of that month
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekDay = firstOfMonth.getDay();

  // E.g., (2 - 0 + 7) % 7 = 2 ⇒ first Tuesday is on day 1 + 2 = 3, (0 mean Sunday)
  const offset = (weekday - firstWeekDay + 7) % 7;

  // E.g., 1 + offset + (2 - 1) * 7 = 10 ⇒ second Tuesday is on day 10
  const dateNum = 1 + offset + (n - 1) * 7;

  const lastDay = new Date(year, month + 1, 0).getDate();
  return dateNum <= lastDay ? new Date(year, month, dateNum) : null;
}

const generateWeekInMonths = (start, end, week, weekDay, interval) => {
  const result = [];
  let cur = new Date(start);

  while (cur <= end) {
    const year = cur.getFullYear();
    const month = cur.getMonth();
    const weekdayIndex = weekDay - 1; // 1–7 → 0–6

    const targetDate =
      week === 'L'
        ? getLastWeekdayOfMonth(year, month, weekdayIndex)
        : getNthWeekdayOfMonth(year, month, weekdayIndex, parseInt(week, 10));

    if (targetDate && targetDate >= start && targetDate <= end) {
      result.push(targetDate);
    }

    // advance by interval months
    cur = new Date(year, month + Number(interval), cur.getDate());
  }

  return result;
};

const useBookingRecurrence = () => {
  const generateTimeSlots = (params, reservation) => {
    const { startDate, endDate, every, dayOfWeeks, onType, onDay, frequency } = params;

    const freq = frequency?.id;
    const endOfDay = moment(endDate).endOf('day').toDate();
    let bases = [];

    if (freq === Repeat.weekly) {
      bases = generateWeekDays(startDate, endOfDay, dayOfWeeks);
    } else if (freq === Repeat.monthly) {
      const interval = parseInt(every, 10);
      if (onType.id === 'DAY') {
        const dayOfMonth = onDay?.id === 'L' ? 'L' : parseInt(onDay.id, 10);
        bases = generateDatesInMonths(startDate, endOfDay, dayOfMonth, interval);
      } else {
        bases = generateWeekInMonths(startDate, endOfDay, onType.code, onDay.id, interval);
      }
    } else {
      bases = getDatesWithInterval(startDate, endOfDay, every);
    }

    return bases.map((d) => ({
      startDate: copyTime(reservation.startTime, d),
      endDate: copyTime(reservation.endTime, d),
    }));
  };

  return { generateTimeSlots };
};

export default useBookingRecurrence;
