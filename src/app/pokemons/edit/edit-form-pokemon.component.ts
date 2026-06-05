import { Component, OnInit, Input } from "@angular/core";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PokemonsService } from "../pokemons.service";

@Component({
  standalone: true,
  selector: 'edit-form-pokemon',
  templateUrl: './edit-form-pokemon.component.html',
  imports: [PokemonTypeColor, FormsModule]
})
export class EditFormPokemonComponent implements OnInit{

  @Input() pokemon: any
  
  types: any = [];

  constructor(private router: Router, private pokemonsService: PokemonsService){
    this.types = this.pokemonsService.getPokemonTypes();
  }

  ngOnInit(): void {

  }


  // 1 - Détermine si le type passé en paramètres appartient ou non au pokémon en cours d'édition
  hasType(type:string):boolean{
    let index = this.pokemon.types.indexOf(type);
    return (index > -1);
    
  }
  
  // 2 - Permet au joueur d'ajouter ou retirer un type au pokémon en cours d'attente
  selectType($event: any, type:string):void
  {
    let checked = $event.target.checked;

    if(checked){
      this.pokemon.types.push(type)
    }else{
      let index = this.pokemon.types.indexOf(type);
      if(index > -1){
        this.pokemon.types.splice(index, 1);
      }
    }
  }

  // 3 - Valide le nombre de type pour chaque pokémon
  isTypesValid(type: string):boolean
  {
    if(this.pokemon.types.length === 1 && this.hasType(type)){ 
      return false;
    }

    if(this.pokemon.types.length >= 3 && !this.hasType(type)){
      return false;
    }

    return true
  }

  

  onSubmit() {
    this.pokemon.hp = Number(this.pokemon.hp);
    this.pokemon.cp = Number(this.pokemon.cp);

    this.pokemonsService.updatePokemon(this.pokemon).subscribe((updated) => {
      const id = updated?.id ?? this.pokemon.id;
      this.router.navigate(['/pokemon', id]);
    });
  }

  goBack() {
    this.router.navigate(['/pokemon', this.pokemon.id]);
  }

}