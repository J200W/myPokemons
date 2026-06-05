import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { DatePipe } from "@angular/common";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { BorderCardDirective } from "../directives/border-card.directive";
import { Router, RouterLink } from "@angular/router";
import { PokemonsService } from "../pokemons.service";
import { SearchPokemonComponent } from "../search-pokemons/search-pokemons.component";
import { PokemonFilterBarComponent } from "./pokemon-filter-bar.component";
import {
    PokemonListCriteria,
    collectPokemonTypes,
    defaultPokemonListCriteria,
    filterAndSortPokemons,
} from "../utils/pokemon-list-filter.util";

@Component({
    standalone: true,
    selector: 'list-pokemons',
    templateUrl: './pokemons.component.html',
    imports: [
        DatePipe,
        PokemonTypeColor,
        BorderCardDirective,
        SearchPokemonComponent,
        RouterLink,
        PokemonFilterBarComponent,
    ],
})
export class PokemonsComponent implements OnInit {

    allPokemons: Pokemon[] = [];
    displayedPokemons: Pokemon[] = [];
    availableTypes: string[] = [];
    pokemonsLoaded = false;
    selectMode = false;
    selectedIds: number[] = [];
    private criteria: PokemonListCriteria = { ...defaultPokemonListCriteria };

    constructor(private router: Router, private pokemonService: PokemonsService) {}

    ngOnInit(): void {
        this.pokemonService.getPokemons().subscribe((pokemons) => {
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

    toggleSelectMode() {
        this.selectMode = !this.selectMode;
        if (!this.selectMode) {
            this.selectedIds = [];
        }
    }

    isSelected(id: number): boolean {
        return this.selectedIds.includes(id);
    }

    onCardClick(pokemon: Pokemon) {
        if (!this.selectMode) {
            this.selectPokemon(pokemon);
            return;
        }

        const index = this.selectedIds.indexOf(pokemon.id);
        if (index > -1) {
            this.selectedIds.splice(index, 1);
            return;
        }

        if (this.selectedIds.length === 0) {
            this.selectedIds.push(pokemon.id);
            return;
        }

        const [p1, p2] = [this.selectedIds[0], pokemon.id];
        this.router.navigate(['/pokemon/compare'], { queryParams: { p1, p2 } });
        this.selectMode = false;
        this.selectedIds = [];
    }
}
