import { TestBed } from '@angular/core/testing';
import { Answer } from '../models/answer.model';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  const answer: Answer = { positionId: 1, verdict: 'EQUAL', confidence: 70 };

  beforeEach(() => {
    service = TestBed.inject(SessionService);
  });

  it('starts with no answers', () => {
    expect(service.answers()).toEqual([]);
    expect(service.answerCount()).toBe(0);
  });

  it('stores a submitted answer', () => {
    service.submitAnswer(answer);
    expect(service.answers()).toEqual([answer]);
    expect(service.answerCount()).toBe(1);
  });

  it('keeps answers in submission order', () => {
    const second: Answer = { positionId: 2, verdict: 'WHITE_BETTER', confidence: 90 };
    service.submitAnswer(answer);
    service.submitAnswer(second);
    expect(service.answers()).toEqual([answer, second]);
  });
});