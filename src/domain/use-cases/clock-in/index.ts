import { Score } from '../../models/score';

export interface ClockIn {
  clockIn(userToken: string): Promise<Score>
}