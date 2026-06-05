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

    //variable qui va récupérer le pokemon sélectionné
    pokemon: any = null;

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
        this.pokemonsService.getPokemon(id).subscribe((pokemon) => this.pokemon = pokemon);
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
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        this.pokemonsService.toggleFavorite(pokemon.id).subscribe((isFavorite) => {
            this.pokemon.isFavorite = isFavorite;
        });
    }
}
