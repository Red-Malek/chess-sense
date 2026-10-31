import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BoardViewComponent } from '../board-view/board-view.component';
import { Answer } from '../models/answer.model';
import { SessionService } from '../services/session.service';
import { VerdictFormComponent } from '../verdict-form/verdict-form.component';
import { SessionPageComponent } from './session-page.component';

@Component({ selector: 'app-board-view', template: '' })
class BoardViewStubComponent {
  readonly fen = input.required<string>();
}

@Component({ selector: 'app-verdict-form', template: '' })
class VerdictFormStubComponent {
  readonly positionId = input.required<number>();
  readonly answered = output<Answer>();
}

describe('SessionPageComponent', () => {
  let fixture: ComponentFixture<SessionPageComponent>;
  let http: HttpTestingController;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(SessionPageComponent, {
        remove: { imports: [BoardViewComponent, VerdictFormComponent] },
        add: { imports: [BoardViewStubComponent, VerdictFormStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionPageComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('passes the first loaded position to the board and form', async () => {
    http.expectOne('data/positions.json').flush([{ id: 1, fen: 'test-fen' }]);
    await fixture.whenStable();

    expect(text()).toContain('Position 1');
    const board = fixture.debugElement.query(By.directive(BoardViewStubComponent));
    expect(board.componentInstance.fen()).toBe('test-fen');
    const form = fixture.debugElement.query(By.directive(VerdictFormStubComponent));
    expect(form.componentInstance.positionId()).toBe(1);
  });

  it('stores the answer and shows the confirmation', async () => {
    http.expectOne('data/positions.json').flush([{ id: 1, fen: 'test-fen' }]);
    await fixture.whenStable();
    expect(text()).not.toContain('Your evaluation has been recorded');

    const answer: Answer = { positionId: 1, verdict: 'EQUAL', confidence: 60 };
    fixture.debugElement
      .query(By.directive(VerdictFormStubComponent))
      .componentInstance.answered.emit(answer);
    await fixture.whenStable();

    expect(TestBed.inject(SessionService).answers()).toEqual([answer]);
    expect(text()).toContain('Your evaluation has been recorded');
    expect(fixture.debugElement.query(By.directive(VerdictFormStubComponent))).toBeNull();
  });
});