import { Column } from "./column";
import { Match } from "./match";
import { Ranking } from "./ranking";

export interface Section {
    name: string;
    columns: Column[];
    rankings: Ranking[];
    matches: Match[];
}