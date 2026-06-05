export class Pokemon{

  id: number;
  hp: number;
  cp: number;
  name: string;
  picture: string;
  types: Array<string>;
  rarity: string;
  isFavorite: boolean;
  created: Date;

  constructor(){
    this.id = 0;
    this.hp = 0;
    this.cp = 0;
    this.name = "";
    this.picture = "";
    this.types = [''];
    this.rarity = "*";
    this.isFavorite = false,
    this.created = new Date();

  }
// https://codeshare.io/5gyRyB

}