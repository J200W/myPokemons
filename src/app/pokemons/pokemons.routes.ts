import { Routes } from "@angular/router";
import { PokemonsComponent } from './list/pokemons.component';
import { DetailPokemonComponent } from './detail/detail-pokemon.component';
import { EditPokemonComponent } from './edit/edit-pokemon.component';
import { AddPokemonComponent } from "./add/add-pokemon.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { ComparePokemonComponent } from "./compare-pokemon-component/compare-pokemon.component";
import { authGuard } from "../core/auth.guard";

export const pokemonsRoutes: Routes = [
  { path: 'all', loadComponent:() => PokemonsComponent },
  { path: 'edit/:id', loadComponent:() => EditPokemonComponent },
  { path: 'favorites', loadComponent:() => FavoritesComponent, canActivate: [authGuard] },
  { path: 'add', loadComponent:() => AddPokemonComponent },
  { path: 'compare', loadComponent:() => ComparePokemonComponent },
  { path: ':id', loadComponent:() => DetailPokemonComponent },
]