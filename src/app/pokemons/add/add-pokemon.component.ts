import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddFormPokemonComponent } from './add-form-pokemon.component';
import { Pokemon } from '../donnees/pokemon';

@Component({
    standalone: true,
    selector: 'add-pokemon',
    imports: [AddFormPokemonComponent],
    templateUrl: './add-pokemon.component.html',
})
export class AddPokemonComponent implements OnInit { 

  //variable qui va récupérer le pokemon sélectionné
  pokemon: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.pokemon = new Pokemon();
    this.pokemon.types = [];
  }
  
  goBack(){
    this.router.navigate(['/']);
  }
}
