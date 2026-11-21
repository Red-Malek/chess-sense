import { Component, input, output } from '@angular/core';
import { Category } from '../setup-config.model';

interface CategoryCard {
  value: Category;
  label: string;
  description: string;
}

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrl: './category-picker.component.css',
})
export class CategoryPickerComponent {
  readonly selected = input.required<readonly Category[]>();
  readonly toggled = output<Category>();

  protected readonly cards: readonly CategoryCard[] = [
    {
      value: 'TACTICAL',
      label: 'Tactical',
      description: 'Forcing moves, threats and combinations.',
    },
    {
      value: 'POSITIONAL',
      label: 'Positional',
      description: 'Structure, space and long-term plans.',
    },
    { value: 'DEFENSIVE', label: 'Defensive', description: 'Holding up under pressure.' },
    { value: 'TECHNICAL', label: 'Technical', description: 'Converting edges with precision.' },
  ];

  protected isSelected(category: Category): boolean {
    return this.selected().includes(category);
  }

  protected onChange(event: Event, category: Category): void {
    const input = event.target as HTMLInputElement;
    if (this.isSelected(category) && this.selected().length === 1) {
      input.checked = true;
      return;
    }
    this.toggled.emit(category);
  }
}
