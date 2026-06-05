import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pokemon } from '../donnees/pokemon';
import { PokemonsService } from '../pokemons.service';
import { PokemonTypeColor } from '../pipes/pokemon-type-color.pipe';
import { PokemonRarity } from '../pipes/pokemon-rarity.pipe';
import { StarIconComponent } from '../icons/star-icon.component';

@Component({
    standalone: true,
    selector: 'compare-pokemon',
    templateUrl: './compare-pokemon.component.html',
    imports: [DatePipe, PokemonTypeColor, PokemonRarity, StarIconComponent, RouterLink],
})
export class ComparePokemonComponent implements OnInit {

    pokemon1: Pokemon = new Pokemon();
    pokemon2: Pokemon = new Pokemon();

    constructor(
        private pokemonsService: PokemonsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            const p1 = Number(params.get('p1'));
            const p2 = Number(params.get('p2'));

            this.pokemonsService.getPokemon(p1).subscribe((pokemon) => {
                if (pokemon) {
                    this.pokemon1 = pokemon;
                }
            });
            this.pokemonsService.getPokemon(p2).subscribe((pokemon) => {
                if (pokemon) {
                    this.pokemon2 = pokemon;
                }
            });
        });
    }

    goBack() {
        this.router.navigate(['/pokemon/all']);
    }
}
