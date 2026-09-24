import { RideStatus } from '../../generated/prisma/enums';

const transitions: Record<RideStatus, RideStatus[]> = {
  [RideStatus.SCHEDULED]: [RideStatus.OPEN, RideStatus.CANCELLED],
  [RideStatus.OPEN]: [RideStatus.IN_PROGRESS, RideStatus.CANCELLED],
  [RideStatus.IN_PROGRESS]: [RideStatus.COMPLETED],
  [RideStatus.COMPLETED]: [],
  [RideStatus.CANCELLED]: [],
};

export function canTransitionRide(from: RideStatus, to: RideStatus) {
  return from === to || transitions[from].includes(to);
}

export function timeDifferenceMinutes(first: string, second: string) {
  const minutes = (value: string) => {
    const [hour, minute] = value.split(':').map(Number);
    return hour * 60 + minute;
  };
  return Math.abs(minutes(first) - minutes(second));
}
