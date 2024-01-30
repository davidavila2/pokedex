import { Routes } from '@angular/router';
import { AllPokemonComponent } from '../../projects/pokemon/src/lib/feature/all-pokemon/all-pokemon.component';
import { PokemonDetailsComponent } from '../../projects/pokemon/src/lib/feature/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  {
    path: '',
    component: AllPokemonComponent,
  },
  {
    path: 'pokemon/:id',
    component: PokemonDetailsComponent,
  },
];
