import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BoardViewComponent } from '../board-view/board-view.component';
import { SessionPageComponent } from './session-page.component';

@Component({ selector: 'app-board-view', template: '' })
class BoardViewStubComponent {
  readonly fen = input.required<string>();
}

describe('SessionPageComponent', () => {
  let fixture: ComponentFixture<SessionPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(SessionPageComponent, {
        remove: { imports: [BoardViewComponent] },
        add: { imports: [BoardViewStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionPageComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('passes the first loaded position to the board', async () => {
    http.expectOne('data/positions.json').flush([{ id: 1, fen: 'test-fen' }]);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Position 1');
    const board = fixture.debugElement.query(By.directive(BoardViewStubComponent));
    expect(board.componentInstance.fen()).toBe('test-fen');
  });
});