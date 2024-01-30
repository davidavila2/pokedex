import {
  Component,
  DestroyRef,
  OnInit,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataAccessService } from '../../../../../data-access/src/lib/data-access.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  dataAccess = inject(DataAccessService);

  pokemon = signal<any>({});
  callState: Signal<{ loading: boolean; error: string | null }> = computed(() =>
    this.dataAccess.callState()
  );

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        console.log('param id: ', params['id']);
        this.dataAccess
          .getPokemonDetails(params['id'])
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((pokemon) => {
            this.pokemon.set(pokemon);
          });
      });
  }
}
