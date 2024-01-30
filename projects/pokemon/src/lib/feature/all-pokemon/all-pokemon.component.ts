import {
  Component,
  signal,
  DestroyRef,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataAccessService } from '../../../../../data-access/src/lib/data-access.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatToolbarModule,
  ],
  templateUrl: './all-pokemon.component.html',
  styleUrl: './all-pokemon.component.scss',
})
export class AllPokemonComponent {
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
