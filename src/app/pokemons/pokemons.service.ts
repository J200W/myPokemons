import { Injectable } from '@angular/core';
import { Pokemon } from './donnees/pokemon';
import { SupabaseService } from '../core/supabase.service';
import { catchError, map, Observable, of, from, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonsService {

  constructor(private supabaseService: SupabaseService) {}

  private log(log: string) {
    console.info(log);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private mapPokemon(row: any): Pokemon {
    const pokemon = new Pokemon();
    pokemon.id = row.id;
    pokemon.name = row.name;
    pokemon.hp = row.hp;
    pokemon.cp = row.cp;
    pokemon.picture = row.picture;
    pokemon.types = row.types ?? [];
    pokemon.rarity = row.rarity;
    pokemon.isFavorite = row.is_favorite;
    pokemon.created = new Date(row.created);
    return pokemon;
  }

  private mapPokemonToDb(pokemon: Pokemon) {
    return {
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types,
      rarity: pokemon.rarity,
      is_favorite: pokemon.isFavorite,
      created: pokemon.created,
    };
  }

  getPokemons(): Observable<Pokemon[]> {
    return from(
      this.supabaseService.getClient().from('pokemons').select('*').order('id')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapPokemon(row));
      }),
      tap(_ => this.log('fetched pokemons')),
      catchError(this.handleError('getPokemons', []))
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    return from(
      this.supabaseService.getClient().from('pokemons').select('*').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapPokemon(data);
      }),
      tap(_ => this.log(`fetched pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
    );
  }

  getPokemonTypes(): string[] {
    return ['Plante', 'Feu', 'Eau', 'Poison', 'Psy', 'Electrik', 'Normal', 'Fée', 'Vol', 'Insecte'];
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return from(
      this.supabaseService.getClient()
        .from('pokemons')
        .update(this.mapPokemonToDb(pokemon))
        .eq('id', pokemon.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapPokemon(data);
      }),
      tap(_ => this.log(`update pokemon id=${pokemon.id}`)),
      catchError(this.handleError<Pokemon>(`updatePokemon id=${pokemon.id}`, pokemon))
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    const payload = this.mapPokemonToDb(pokemon);

    return from(
      this.supabaseService.getClient()
        .from('pokemons')
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapPokemon(data);
      }),
      tap(_ => this.log('addPokemon')),
      catchError(this.handleError<Pokemon>('addPokemon', {} as Pokemon))
    );
  }

  searchPokemons(term: string): Observable<Pokemon[]> {
    if (!term.trim()) {
      return of([]);
    }

    return from(
      this.supabaseService.getClient()
        .from('pokemons')
        .select('*')
        .ilike('name', `%${term}%`)
        .order('id')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapPokemon(row));
      }),
      tap(_ => this.log(`fetched pokemons term=${term}`)),
      catchError(this.handleError<Pokemon[]>(`searchPokemons term=${term}`, []))
    );
  }

  deletePokemon(id: string): Observable<Pokemon> {
    return from(
      this.supabaseService.getClient()
        .from('pokemons')
        .delete()
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return this.mapPokemon(data);
      }),
      tap(_ => this.log(`deleted pokemons id=${id}`)),
      catchError(this.handleError<Pokemon>(`error deleted pokemons id=${id}`))
    );
  }

  getFavorites(): Observable<Pokemon[]> {
    return from(
      this.supabaseService.getClient()
        .from('pokemons')
        .select('*')
        .eq('is_favorite', true)
        .order('id')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapPokemon(row));
      }),
      tap(_ => this.log('fetched favorite pokemons')),
      catchError(this.handleError<Pokemon[]>('error fetching favorite pokemons', []))
    );
  }
}
