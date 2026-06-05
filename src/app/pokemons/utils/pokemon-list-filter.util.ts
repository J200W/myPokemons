import { Pokemon } from '../donnees/pokemon';

/** Champ utilisé pour trier la liste des Pokémon. */
export type PokemonSortField = 'name' | 'hp' | 'cp' | 'rarity' | 'created';

/** Sens du tri : croissant ou décroissant. */
export type SortDirection = 'asc' | 'desc';

/** Critères de tri et de filtrage appliqués à une liste de Pokémon. */
export interface PokemonListCriteria {
    sortBy: PokemonSortField;
    sortDirection: SortDirection;
    types: string[];
}

/** Valeurs par défaut : tri par nom, ordre croissant, aucun filtre de type. */
export const defaultPokemonListCriteria: PokemonListCriteria = {
    sortBy: 'name',
    sortDirection: 'asc',
    types: [],
};

/**
 * Filtre puis trie une liste de Pokémon selon les critères choisis.
 * - filtre : conserve les Pokémon ayant au moins un des types sélectionnés
 * - tri : nom, PV, dégâts, rareté (nombre d'étoiles) ou date de création
 */
export function filterAndSortPokemons(pokemons: Pokemon[], criteria: PokemonListCriteria): Pokemon[] {
    let result = [...pokemons];

    if (criteria.types.length > 0) {
        result = result.filter((pokemon) =>
            pokemon.types.some((type) => criteria.types.includes(type))
        );
    }

    const direction = criteria.sortDirection === 'asc' ? 1 : -1;

    result.sort((a, b) => {
        switch (criteria.sortBy) {
            case 'name':
                return direction * a.name.localeCompare(b.name, 'fr');
            case 'hp':
                return direction * (a.hp - b.hp);
            case 'cp':
                return direction * (a.cp - b.cp);
            case 'rarity':
                return direction * (a.rarity.length - b.rarity.length);
            case 'created':
                return direction * (a.created.getTime() - b.created.getTime());
            default:
                return 0;
        }
    });

    return result;
}

/**
 * Extrait tous les types distincts présents dans une liste de Pokémon.
 * Utilisé pour alimenter les chips de filtrage (liste et favoris).
 */
export function collectPokemonTypes(pokemons: Pokemon[]): string[] {
    const types = new Set<string>();
    for (const pokemon of pokemons) {
        for (const type of pokemon.types) {
            types.add(type);
        }
    }
    return [...types].sort((a, b) => a.localeCompare(b, 'fr'));
}
