import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PositionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads positions from the JSON file', () => {
    service.load();
    expect(service.loading()).toBe(true);

    http.expectOne('data/positions.json').flush([{ id: 1, fen: 'test-fen' }]);

    expect(service.positions()).toEqual([{ id: 1, fen: 'test-fen' }]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('sets an error when the request fails', () => {
    service.load();

    http.expectOne('data/positions.json').flush('missing', { status: 404, statusText: 'Not Found' });

    expect(service.positions()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).not.toBeNull();
  });
});