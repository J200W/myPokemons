import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../donnees/pokemon';
import { BorderCardDirective } from '../directives/border-card.directive';
import { DatePipe } from '@angular/common';
import { PokemonTypeColor } from '../pipes/pokemon-type-color.pipe';

@Component({
    selector: 'favorites-component',
    imports: [BorderCardDirective, DatePipe, PokemonTypeColor],
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {

    pokemons: Pokemon[] = [];

    constructor(private router: Router, private pokemonsService: PokemonsService) {}

    ngOnInit(): void {
        this.pokemonsService.getFavorites().subscribe((pokemons) => {
            this.pokemons = pokemons;
        })
    }

    selectPokemon(pokemon: Pokemon) {
        let link = ['/pokemon', pokemon.id];
        this.router.navigate(link);
    }
}
