import { Component, input, output } from '@angular/core';

export interface SegmentedOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
  hint?: string;
}

@Component({
  selector: 'app-segmented-group',
  templateUrl: './segmented-group.component.html',
  styleUrl: './segmented-group.component.css',
})
export class SegmentedGroupComponent<T extends string | number> {
  readonly name = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<readonly SegmentedOption<T>[]>();
  readonly value = input<T | null>(null);
  readonly selectionChange = output<T>();
}
