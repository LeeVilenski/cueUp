import { getSessionStreaks, getTotalPracticeMinutes, getWeeklySessionCount } from '@/lib/stats/sessions';
import { makeBreakLog, makeSession } from '@/lib/stats/test-fixtures';

describe('getSessionStreaks', () => {
  it('returns zero streaks when there are no sessions or break logs', () => {
    expect(getSessionStreaks([], [])).toEqual({ current: 0, longest: 0 });
  });

  it('counts the current streak including today', () => {
    const now = new Date('2024-01-10T18:00:00.000Z');
    const sessions = [
      makeSession({ startedAt: '2024-01-08T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-09T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-10T09:00:00.000Z' }),
    ];

    expect(getSessionStreaks(sessions, [], now)).toEqual({ current: 3, longest: 3 });
  });

  it('counts the current streak as still alive if the most recent session was yesterday', () => {
    const now = new Date('2024-01-10T08:00:00.000Z');
    const sessions = [
      makeSession({ startedAt: '2024-01-08T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-09T09:00:00.000Z' }),
    ];

    expect(getSessionStreaks(sessions, [], now)).toEqual({ current: 2, longest: 2 });
  });

  it('resets the current streak if there is a gap since yesterday', () => {
    const now = new Date('2024-01-10T08:00:00.000Z');
    const sessions = [
      makeSession({ startedAt: '2024-01-01T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-02T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-03T09:00:00.000Z' }),
    ];

    expect(getSessionStreaks(sessions, [], now)).toEqual({ current: 0, longest: 3 });
  });

  it('finds the longest streak even if it is not the most recent', () => {
    const now = new Date('2024-01-20T08:00:00.000Z');
    const sessions = [
      makeSession({ startedAt: '2024-01-01T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-02T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-03T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-04T09:00:00.000Z' }),
      makeSession({ startedAt: '2024-01-10T09:00:00.000Z' }),
    ];

    expect(getSessionStreaks(sessions, [], now)).toEqual({ current: 0, longest: 4 });
  });

  it('counts a break log on its own as a streak day, even without a session', () => {
    const now = new Date('2024-01-10T18:00:00.000Z');
    const sessions = [makeSession({ startedAt: '2024-01-09T09:00:00.000Z' })];
    const breakLogs = [makeBreakLog({ achievedAt: '2024-01-10T19:00:00.000Z' })];

    expect(getSessionStreaks(sessions, breakLogs, now)).toEqual({ current: 2, longest: 2 });
  });
});

describe('getWeeklySessionCount', () => {
  it('counts sessions since Monday 00:00 UTC of the current week', () => {
    // 2024-01-10 is a Wednesday; 2024-01-08 is the preceding Monday.
    const now = new Date('2024-01-10T12:00:00.000Z');
    const sessions = [
      makeSession({ startedAt: '2024-01-07T23:00:00.000Z' }), // Sunday, last week
      makeSession({ startedAt: '2024-01-08T01:00:00.000Z' }), // Monday, this week
      makeSession({ startedAt: '2024-01-09T12:00:00.000Z' }), // Tuesday, this week
      makeSession({ startedAt: '2024-01-10T11:00:00.000Z' }), // today
    ];

    expect(getWeeklySessionCount(sessions, now)).toBe(3);
  });
});

describe('getTotalPracticeMinutes', () => {
  it('sums duration minutes, treating missing durations as zero', () => {
    const sessions = [
      makeSession({ durationMins: 30 }),
      makeSession({ durationMins: null }),
      makeSession({ durationMins: 45 }),
    ];

    expect(getTotalPracticeMinutes(sessions)).toBe(75);
  });
});
