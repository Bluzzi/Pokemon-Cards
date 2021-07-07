import type { ISetImage } from "./Image";
import type { ILegality } from "./Legality";

export interface ISet {
    id: string;
    images: ISetImage;
    legalities: ILegality;
    name:  string;
    printedTotal: number;
    ptcgoCode: string;
    releaseDate: string;
    series:  string;
    total: number;
    updatedAt: string;
}