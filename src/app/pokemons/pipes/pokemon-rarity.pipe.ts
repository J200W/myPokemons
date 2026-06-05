import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'pokemonRarity' })
export class PokemonRarity implements PipeTransform {

    transform(rarity: string): string {

        let color: string;
        let value = rarity.length;

        switch (value) {
            case 3:
            case 4:
                color = '#C4C4C4';
                break;
            
            case 5:
                color = '#EFBF04';
                break;

            case 1:
            case 2:
            default:
                color = '#CE8946';
                break;
        }

        return `${color}`;

    }


}