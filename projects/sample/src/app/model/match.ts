import { Strategy } from "./strategy";
import { Team } from "./team";

export class Match {
    id!: string;
    dateTime?: Date;
    result?: string;
    score!: string;
    teams!: Team[];
    strategy!: Strategy;
}