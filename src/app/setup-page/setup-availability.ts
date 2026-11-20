import { Injectable, inject } from '@angular/core';
import { PositionService } from '../services/position.service';
import { SetupFilters } from './setup-config.model';

/**
 * Adapter between the setup page and the position dataset.
 *
 * The dataset currently holds only `id` and `fen`: positions carry no category, difficulty or
 * game phase, so no filter can narrow the pool yet. Until that metadata exists this returns the
 * full pool for every filter combination. Replace the body of `countMatching` once positions are
 * tagged; the setup page needs no other change. Reads signals, so call it inside a `computed`.
 */
@Injectable({ providedIn: 'root' })
export class SetupAvailability {
  private readonly positions = inject(PositionService);

  readonly loading = this.positions.loading;
  readonly error = this.positions.error;

  load(): void {
    this.positions.load();
  }

  countMatching(_filters: SetupFilters): number {
    return this.positions.positions().length;
  }
}
