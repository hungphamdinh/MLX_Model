import { renderHook } from '@testing-library/react-hooks';
import { Repeat } from '@Config/Constants';
import useBookingRecurrence from '../../../Booking/BookingRecurring/useBookingRecurrence';

const makeIso = (date) => date.toISOString().split('.')[0];

describe('useBookingRecurrence', () => {
  const reservation = {
    startTime: '2025-05-01T09:00:00',
    endTime: '2025-05-01T10:00:00',
  };

  it('generates daily intervals correctly', () => {
    // Daily recurrence: every 1 day
    const { result } = renderHook(() => useBookingRecurrence());

    const rec = {
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-03'),
      every: '1',
      dayOfWeeks: [],
      onType: {},
      onDay: null,
    };

    const slots = result.current.generateTimeSlots({ ...rec, frequency: { id: Repeat.daily } }, reservation);
    expect(slots).toHaveLength(3);
    expect(slots.map((s) => s.startDate)).toEqual([
      makeIso(new Date('2025-05-01T09:00:00Z')),
      makeIso(new Date('2025-05-02T09:00:00Z')),
      makeIso(new Date('2025-05-03T09:00:00Z')),
    ]);
    expect(slots[0].endDate).toEqual(makeIso(new Date('2025-05-01T10:00:00Z')));
  });

  it('generates weekly intervals correctly', () => {
    // Weekly recurrence: every 1 week on Thursday
    const { result } = renderHook(() => useBookingRecurrence());
    const rec = {
      startDate: new Date('2025-05-01'), // Thursday
      endDate: new Date('2025-05-15'),
      every: '1',
      dayOfWeeks: [{ id: 5 }], // Thursday (5)
      onType: {},
      onDay: null,
    };
    const slots = result.current.generateTimeSlots({ ...rec, frequency: { id: Repeat.weekly } }, reservation);
    expect(slots.map((s) => s.startDate)).toEqual([
      makeIso(new Date('2025-05-01T09:00:00Z')),
      makeIso(new Date('2025-05-08T09:00:00Z')),
      makeIso(new Date('2025-05-15T09:00:00Z')),
    ]);
  });

  it('generates monthly by specific day correctly', () => {
    // Monthly recurrence: every 1 month on the 15th day
    const { result } = renderHook(() => useBookingRecurrence());
    const rec = {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      every: '1',
      dayOfWeeks: [],
      onType: { id: 'DAY', code: null },
      onDay: { id: 15 }, // 15th of each month
    };
    const slots = result.current.generateTimeSlots({ ...rec, frequency: { id: Repeat.monthly } }, reservation);
    expect(slots.map((s) => s.startDate)).toEqual([
      makeIso(new Date('2025-01-15T09:00:00Z')),
      makeIso(new Date('2025-02-15T09:00:00Z')),
      makeIso(new Date('2025-03-15T09:00:00Z')),
    ]);
  });

  it('generates monthly by weekday correctly (2nd Tuesday)', () => {
    // Monthly recurrence: every 1 month on the 2nd Tuesday
    const { result } = renderHook(() => useBookingRecurrence());
    const rec = {
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-31'),
      every: '1',
      dayOfWeeks: [],
      onType: { id: 'WEEK', code: 2 }, // Second
      onDay: { id: 3 }, // Tuesday
      frequency: { id: Repeat.monthly },
    };
    const slots = result.current.generateTimeSlots(rec, reservation);
    expect(slots.map((s) => s.startDate)).toEqual([
      makeIso(new Date('2025-06-10T09:00:00Z')),
      makeIso(new Date('2025-07-08T09:00:00Z')),
      makeIso(new Date('2025-08-12T09:00:00Z')),
    ]);
  });

  it('generates monthly on last day correctly', () => {
    // Monthly recurrence: every 1 month on the last day
    const { result } = renderHook(() => useBookingRecurrence());
    const rec = {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      every: '1',
      dayOfWeeks: [],
      onType: { id: 'DAY', code: null },
      onDay: { id: 'L' }, // Last day
      frequency: { id: Repeat.monthly },
    };
    const slots = result.current.generateTimeSlots(rec, reservation);
    expect(slots.map((s) => s.startDate)).toEqual([
      makeIso(new Date('2025-01-31T09:00:00Z')),
      makeIso(new Date('2025-02-28T09:00:00Z')),
      makeIso(new Date('2025-03-31T09:00:00Z')),
    ]);
  });
});
