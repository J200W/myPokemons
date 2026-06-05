import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRarity } from "../pipes/pokemon-rarity.pipe";
import { StarIconComponent } from "../icons/star-icon.component";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { DatePipe } from "@angular/common";
import { PokemonsService } from "../pokemons.service";
import { AuthService } from "../../core/auth.service";

@Component({
    standalone: true,
    selector: 'detail-pokemon',
    templateUrl: 'detail-pokemon.component.html',
    imports: [PokemonTypeColor, PokemonRarity, StarIconComponent, DatePipe]
})
export class DetailPokemonComponent implements OnInit {

    pokemon: Pokemon | null = null;
    previousId: number | null = null;
    nextId: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pokemonsService: PokemonsService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.loadPokemon(Number(params.get('id')));
        });

        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe(() => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadPokemon(id);
        });
    }

    private loadPokemon(id: number) {
        if (!id) {
            return;
        }

        this.pokemonsService.getPokemon(id).subscribe((pokemon) => {
            if (!pokemon) {
                this.pokemon = null;
                this.previousId = null;
                this.nextId = null;
                return;
            }

            this.pokemon = pokemon;
            this.loadAdjacentIds(pokemon.id);
        });
    }

    // Charge les identifiants des pokémons précédent et suivant
    // en fonction de l'identifiant du pokémon courant
    private loadAdjacentIds(id: number) {
        this.pokemonsService.getAdjacentPokemonIds(id).subscribe(({ previousId, nextId }) => {
            this.previousId = previousId;
            this.nextId = nextId;
        });
    }

    goBack() {
        this.router.navigate(['/pokemon/all']);
    }

    goToPrevious() {
        if (this.previousId) {
            this.router.navigate(['/pokemon', this.previousId]);
        }
    }

    goToNext() {
        if (this.nextId) {
            this.router.navigate(['/pokemon', this.nextId]);
        }
    }

    goEdit(pokemon: Pokemon) {
        this.router.navigate(['/pokemon/edit', pokemon.id]);
    }

    deletePokemon(pokemon: Pokemon) {
        if (confirm(`Voulez-vous vraiment supprimer ${pokemon.name} ?`)) {
            this.pokemonsService.deletePokemon(Number(pokemon.id).toString()).subscribe(() => {
                this.goBack();
            });
        }
    }

    toggleFavorite(pokemon: Pokemon) {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        this.pokemonsService.toggleFavorite(pokemon.id).subscribe((isFavorite) => {
            if (this.pokemon) {
                this.pokemon.isFavorite = isFavorite;
            }
        });
    }
}
