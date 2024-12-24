import { ITimeProvider } from '../interfaces/time-provider.interface';

export class TimeProvider implements ITimeProvider {
  now(): number {
    return Date.now();
  }
}
