import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryPickerComponent } from './category-picker/category-picker.component';
import {
  SegmentedGroupComponent,
  SegmentedOption,
} from './segmented-group/segmented-group.component';
import { SetupAvailability } from './setup-availability';
import {
  ALL_CATEGORIES,
  Category,
  Difficulty,
  GamePhase,
  LENGTH_OPTIONS,
  SetupConfig,
} from './setup-config.model';

const DIFFICULTY_OPTIONS: SegmentedOption<Difficulty>[] = [
  { value: 'ALL', label: 'All' },
  { value: 'EASY', label: 'Easy' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

const PHASE_OPTIONS: SegmentedOption<GamePhase>[] = [
  { value: 'ALL', label: 'All' },
  { value: 'OPENING', label: 'Opening' },
  { value: 'MIDDLEGAME', label: 'Middlegame' },
  { value: 'ENDGAME', label: 'Endgame' },
];

const LABELS: Record<string, string> = {
  TACTICAL: 'Tactical',
  POSITIONAL: 'Positional',
  DEFENSIVE: 'Defensive',
  TECHNICAL: 'Technical',
  EASY: 'Easy',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  OPENING: 'Opening',
  MIDDLEGAME: 'Middlegame',
  ENDGAME: 'Endgame',
};

@Component({
  imports: [CategoryPickerComponent, SegmentedGroupComponent],
  selector: 'app-setup-page',
  styleUrl: './setup-page.component.css',
  templateUrl: './setup-page.component.html',
})
export class SetupPageComponent {
  private readonly router = inject(Router);
  private readonly availability = inject(SetupAvailability);

  protected readonly difficultyOptions = DIFFICULTY_OPTIONS;
  protected readonly phaseOptions = PHASE_OPTIONS;

  protected readonly categories = signal<readonly Category[]>(ALL_CATEGORIES);
  protected readonly difficulty = signal<Difficulty>('ALL');
  protected readonly phase = signal<GamePhase>('ALL');
  private readonly requestedLength = signal(10);

  protected readonly matchCount = computed(() =>
    this.availability.countMatching({
      categories: this.categories(),
      difficulty: this.difficulty(),
      phase: this.phase(),
    }),
  );

  /** Largest preset that fits the pool; if the pool is smaller than every preset, use all of it. */
  protected readonly sessionLength = computed(() => {
    const available = this.matchCount();
    const requested = this.requestedLength();
    if (requested <= available) return requested;
    const fitting = LENGTH_OPTIONS.filter((n) => n <= available);
    return fitting.length ? Math.max(...fitting) : available;
  });

  protected readonly lengthOptions = computed<SegmentedOption<number>[]>(() => {
    const available = this.matchCount();
    return LENGTH_OPTIONS.map((n) => ({
      value: n,
      label: String(n),
      disabled: n > available,
      hint:
        n > available
          ? `Only ${available} matching position${available === 1 ? '' : 's'}`
          : undefined,
    }));
  });

  protected readonly selectedLength = computed(() => {
    const length = this.sessionLength();
    return LENGTH_OPTIONS.includes(length) ? length : null;
  });

  protected readonly lengthNote = computed(() => {
    const available = this.matchCount();
    if (available === 0) return null;
    if (available < LENGTH_OPTIONS[0]) {
      return `Only ${available} position${available === 1 ? ' is' : 's are'} available, so the session will use all of them.`;
    }
    return available < LENGTH_OPTIONS[LENGTH_OPTIONS.length - 1]
      ? `Only ${available} positions match your filters.`
      : null;
  });

  protected readonly disabledReason = computed<string | null>(() => {
    if (this.availability.loading()) return 'Loading positions…';
    if (this.availability.error()) return this.availability.error();
    if (this.matchCount() === 0) return 'No positions match these filters.';
    return null;
  });

  protected readonly canStart = computed(() => this.disabledReason() === null);

  protected readonly summary = computed(() => {
    const n = this.sessionLength();
    const cats = this.categories();
    const parts = [
      `${n} position${n === 1 ? '' : 's'}`,
      cats.length === ALL_CATEGORIES.length
        ? 'All categories'
        : cats.map((c) => LABELS[c]).join(', '),
      this.difficulty() === 'ALL' ? 'All levels' : LABELS[this.difficulty()],
      this.phase() === 'ALL' ? 'All phases' : LABELS[this.phase()],
    ];
    return parts.join(' · ');
  });

  constructor() {
    this.availability.load();
  }

  protected toggleCategory(category: Category): void {
    this.categories.update((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : ALL_CATEGORIES.filter((c) => c === category || current.includes(c)),
    );
  }

  protected setDifficulty(value: Difficulty): void {
    this.difficulty.set(value);
  }

  protected setPhase(value: GamePhase): void {
    this.phase.set(value);
  }

  protected setLength(value: number): void {
    this.requestedLength.set(value);
  }

  protected start(): void {
    if (!this.canStart()) return;
    const config: SetupConfig = {
      categories: this.categories(),
      difficulty: this.difficulty(),
      phase: this.phase(),
      length: this.sessionLength(),
    };
    void this.router.navigate(['/session'], {
      queryParams: {
        categories: config.categories.join(','),
        difficulty: config.difficulty,
        phase: config.phase,
        length: config.length,
      },
    });
  }
}
