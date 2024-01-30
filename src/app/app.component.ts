import {
  Component,
  signal,
  DestroyRef,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataAccessService } from '../../projects/data-access/src/public-api';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  destroyRef = inject(DestroyRef);

  pokemon = signal<any>([]);
  pageInfo: Signal<{ count: number; next: string; previous: string }> =
    computed(() => this.dataAccess.pageInfo());
  callState: Signal<{ loading: boolean; error: string | null }> = computed(() =>
    this.dataAccess.callState()
  );

  constructor(private dataAccess: DataAccessService) {
    this.dataAccess
      .getPokemon()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
      });
  }

  loadMore() {
    this.dataAccess
      .getNextPokemon()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
      });
  }

  loadPrevious() {
    this.dataAccess
      .getPreviousPokemon()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
      });
  }
}
