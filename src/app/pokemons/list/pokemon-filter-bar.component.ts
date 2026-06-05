import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonTypeColor } from '../pipes/pokemon-type-color.pipe';
import {
    PokemonListCriteria,
    PokemonSortField,
    defaultPokemonListCriteria,
} from '../utils/pokemon-list-filter.util';

@Component({
    selector: 'pokemon-filter-bar',
    standalone: true,
    imports: [FormsModule, PokemonTypeColor],
    templateUrl: './pokemon-filter-bar.component.html',
})
export class PokemonFilterBarComponent implements OnChanges {

    @Input() availableTypes: string[] = [];
    @Output() criteriaChange = new EventEmitter<PokemonListCriteria>();

    criteria: PokemonListCriteria = { ...defaultPokemonListCriteria };

    readonly sortOptions: { value: PokemonSortField; label: string }[] = [
        { value: 'name', label: 'Nom' },
        { value: 'hp', label: 'Points de vie' },
        { value: 'cp', label: 'Dégâts' },
        { value: 'rarity', label: 'Rareté' },
        { value: 'created', label: 'Date de création' },
    ];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['availableTypes']) {
            this.criteria.types = this.criteria.types.filter((type) =>
                this.availableTypes.includes(type)
            );
            this.emitCriteria();
        }
    }

    onSortChange() {
        this.emitCriteria();
    }

    toggleType(type: string) {
        const index = this.criteria.types.indexOf(type);
        if (index > -1) {
            this.criteria.types.splice(index, 1);
        } else {
            this.criteria.types.push(type);
        }
        this.emitCriteria();
    }

    isTypeSelected(type: string): boolean {
        return this.criteria.types.includes(type);
    }

    toggleSortDirection() {
        this.criteria.sortDirection =
            this.criteria.sortDirection === 'asc' ? 'desc' : 'asc';
        this.emitCriteria();
    }

    resetFilters() {
        this.criteria = { ...defaultPokemonListCriteria };
        this.emitCriteria();
    }

    get hasActiveFilters(): boolean {
        return this.criteria.types.length > 0
            || this.criteria.sortBy !== defaultPokemonListCriteria.sortBy
            || this.criteria.sortDirection !== defaultPokemonListCriteria.sortDirection;
    }

    get sortDirectionLabel(): string {
        return this.criteria.sortDirection === 'asc' ? 'Croissant' : 'Décroissant';
    }

    private emitCriteria() {
        this.criteriaChange.emit({
            sortBy: this.criteria.sortBy,
            sortDirection: this.criteria.sortDirection,
            types: [...this.criteria.types],
        });
    }
}
