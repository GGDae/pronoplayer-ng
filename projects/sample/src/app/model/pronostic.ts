import { MatchScore } from "./matchScore";

export class Pronostic {
    id?: string;
    competitionId?: string;
    userId?: string;
    groupId?: string;
    weekId?: string;
    dayy?: number;
    scores!: MatchScore[];
}