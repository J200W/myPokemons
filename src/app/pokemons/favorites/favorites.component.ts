import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../donnees/pokemon';
import { BorderCardDirective } from '../directives/border-card.directive';
import { DatePipe } from '@angular/common';
import { PokemonTypeColor } from '../pipes/pokemon-type-color.pipe';
import { PokemonFilterBarComponent } from '../list/pokemon-filter-bar.component';
import {
    PokemonListCriteria,
    collectPokemonTypes,
    defaultPokemonListCriteria,
    filterAndSortPokemons,
} from '../utils/pokemon-list-filter.util';

@Component({
    selector: 'favorites-component',
    imports: [BorderCardDirective, DatePipe, PokemonTypeColor, PokemonFilterBarComponent],
    templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit {

    allPokemons: Pokemon[] = [];
    displayedPokemons: Pokemon[] = [];
    availableTypes: string[] = [];
    pokemonsLoaded = false;
    private criteria: PokemonListCriteria = { ...defaultPokemonListCriteria };

    constructor(private router: Router, private pokemonsService: PokemonsService) {}

    ngOnInit(): void {
        this.pokemonsService.getFavorites().subscribe((pokemons) => {
            this.allPokemons = pokemons;
            this.availableTypes = collectPokemonTypes(pokemons);
            this.applyFilterAndSort();
            this.pokemonsLoaded = true;
        });
    }

    onCriteriaChange(criteria: PokemonListCriteria) {
        this.criteria = criteria;
        this.applyFilterAndSort();
    }

    private applyFilterAndSort() {
        this.displayedPokemons = filterAndSortPokemons(this.allPokemons, this.criteria);
    }

    selectPokemon(pokemon: Pokemon) {
        this.router.navigate(['/pokemon', pokemon.id]);
    }
}
