import type { IAbility } from "./Ability";
import type { IAncientTrait } from "./AncientTrait";
import type { IAttack } from "./Attack";
import type { IResistance } from "./Resistance";
import type { IWeakness } from "./Weakness";
import type { ICardImage } from "./Image";
import type { ILegality } from "./Legality";
import type { ISet } from "./Set";
import type { ITCGPlayer } from "./TCGPlayer";

export interface ICard {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    hp?: string;
    types?: string[];
    evolvesFrom?: string;
    evolvesTo?: string[];
    rules?: string[];
    ancientTrait?: IAncientTrait;
    abilities?: IAbility[];
    attacks?: IAttack[];
    weaknesses?: IWeakness[];
    resistances?: IResistance[];
    retreatCost?: string[];
    convertedRetreatCost?: number;
    set: ISet;
    number: string;
    artist?: string;
    rarity: string;
    flavorText?: string;
    nationalPokedexNumbers?: number[];
    legalities: ILegality;
    images: ICardImage;
    tcgplayer?: ITCGPlayer;
}