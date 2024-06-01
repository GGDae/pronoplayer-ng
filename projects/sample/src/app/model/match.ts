import { Strategy } from "./strategy";
import { Team } from "./team";

export class Match {
    id!: string;
    dateTime!: Date;
    locked?: boolean;
    result?: string;
    score!: string;
    state!: string;
    teams!: Team[];
    strategy!: Strategy;
}