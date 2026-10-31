import { Verdict } from './verdict.model';

export interface Answer {
  positionId: number;
  verdict: Verdict;
  confidence: number;
}