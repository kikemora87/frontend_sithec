export interface PokemonDetail {
    id: number;
    order: number;
    name: string;
    height: number;
    weight: number;
    abilities: Ability[];
    species: Species;
    types: Type[];
    sprites: Sprite;
    stats: Stat[];
}

export interface Ability  {
    ability: {
        name: string;
    }
}

export interface Species {
    url: string;
}

export interface Type {
    slot: number;
    type: {
        name: string;
    }
}

export interface Sprite {
    front_default: string;
}

export interface Stat {
    base_stat: number;
    stat: {
        name: string;
    }
}