import { Routes } from '@angular/router';
import { pokemonsRoutes } from './pokemons/pokemons.routes';
import { CounterComponent } from './pokemons/counter/counter.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon/all', pathMatch: 'full' },
  { path: 'login', loadComponent: () => LoginComponent },
  { path: 'register', loadComponent: () => RegisterComponent },
  { path: 'counter', loadComponent: () => CounterComponent },
  { path: 'pokemon', children: pokemonsRoutes },
  { path: '**', loadComponent: () => PageNotFoundComponent },
];
