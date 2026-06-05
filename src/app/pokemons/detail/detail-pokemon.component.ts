import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { StarIconComponent } from "../icons/star-icon.component";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { PokemonsService } from "../pokemons.service";

@Component({
    standalone: true,
    selector: 'detail-pokemon',
    templateUrl: 'detail-pokemon.component.html',
    imports: [PokemonTypeColor, PokemonRarity, StarIconComponent, DatePipe]
})
export class DetailPokemonComponent implements OnInit {

    //variable qui va récupérer le pokemon sélectionné
    pokemon: any = null;

    constructor(private route: ActivatedRoute, private router: Router,
        private pokemonsService: PokemonsService
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = Number(params.get('id'));
            this.pokemonsService.getPokemon(id).subscribe((pokemon) => this.pokemon = pokemon);
        });
    }

    goBack() {
        this.router.navigate(['/pokemon/all']);
    }

    goTo(id: number) {
        this.router.navigate(['/pokemon', id]);
    }

    goEdit(pokemon: Pokemon) {
        let link = ['/pokemon/edit', pokemon.id];
        this.router.navigate(link);
    }

    deletePokemon(pokemon: Pokemon) {
        if (confirm(`Voulez-vous vraiment supprimer ${pokemon.name} ?`)) {
            this.pokemonsService.deletePokemon(Number(pokemon.id).toString()).subscribe((pokemon) => {
                this.goBack();
            });
        }
    }

    toggleFavorite(pokemon: Pokemon) {
        pokemon.isFavorite = !pokemon.isFavorite;

        this.pokemonsService.updatePokemon(pokemon).subscribe((updated) => {
            if (updated) {
                this.pokemon = updated;
            }
            const current = this.pokemon;
            if (current.isFavorite) {
                console.log('Add pokemon to favorite :', current);
            } else {
                console.log('Remove pokemon to favorite :', current);
            }
        });
    }
}
