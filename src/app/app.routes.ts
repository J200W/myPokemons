import { Routes } from '@angular/router';
import { pokemonsRoutes } from './pokemons/pokemons.routes';
import { CounterComponent } from './pokemons/counter/counter.component';
import { PageNotFoundComponent } from './page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon/all', pathMatch: 'full' },
  { path: 'counter', loadComponent: () => CounterComponent },
  { path: 'pokemon', children: pokemonsRoutes },
  { path: '**', loadComponent: () => PageNotFoundComponent },
];
