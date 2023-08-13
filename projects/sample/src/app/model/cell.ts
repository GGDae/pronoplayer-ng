import { Match } from "./match";

export interface Cell {
    name: string;
    slug: string;
    matches: Match[];
}