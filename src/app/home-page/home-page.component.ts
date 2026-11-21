import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { EmblemComponent } from '../emblem/emblem.component';
import { ProgressPreviewComponent } from '../progress-preview/progress-preview.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';

@Component({
  imports: [
    RouterLink,
    NgTemplateOutlet,
    EmblemComponent,
    ProgressPreviewComponent,
    SiteFooterComponent,
  ],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly loggedIn = inject(AuthStateService).loggedIn;

  protected readonly steps = [
    {
      icon: 'eye',
      title: 'See the position',
      text: 'A real position appears on the board. Take it in.',
    },
    {
      icon: 'gauge',
      title: 'Judge it and set your confidence',
      text: 'Pick White, Equal or Black, then rate how sure you are.',
    },
    {
      icon: 'bulb',
      title: 'Get the verdict and learn',
      text: 'Compare your call with the engine and read why.',
    },
  ] as const;

  protected readonly features = [
    {
      icon: 'scale',
      title: 'Evaluation Training',
      text: 'Judge positions as White better, Equal or Black better, and test your instincts.',
    },
    {
      icon: 'gauge',
      title: 'Confidence Calibration',
      text: 'Attach 50–100% confidence to every call, so overconfidence and doubt both show.',
    },
    {
      icon: 'bars',
      title: 'Progress Tracking',
      text: 'See how your accuracy and your confidence line up over time.',
    },
  ] as const;
}
