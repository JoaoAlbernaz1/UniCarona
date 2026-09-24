import { RideStatus } from '../../generated/prisma/enums';
import { canTransitionRide, timeDifferenceMinutes } from './domain-rules';

describe('Ride state rules', () => {
  it('allows the happy-path state machine', () => {
    expect(canTransitionRide(RideStatus.SCHEDULED, RideStatus.OPEN)).toBe(true);
    expect(canTransitionRide(RideStatus.OPEN, RideStatus.IN_PROGRESS)).toBe(true);
    expect(canTransitionRide(RideStatus.IN_PROGRESS, RideStatus.COMPLETED)).toBe(true);
  });

  it('never reopens a completed ride', () => {
    expect(canTransitionRide(RideStatus.COMPLETED, RideStatus.OPEN)).toBe(false);
  });

  it('accepts retries of the current state as idempotent', () => {
    expect(canTransitionRide(RideStatus.IN_PROGRESS, RideStatus.IN_PROGRESS)).toBe(true);
  });
});

describe('Matching time window', () => {
  it('calculates the absolute difference in minutes', () => {
    expect(timeDifferenceMinutes('07:20', '07:00')).toBe(20);
    expect(timeDifferenceMinutes('07:20', '07:30')).toBe(10);
  });
});
