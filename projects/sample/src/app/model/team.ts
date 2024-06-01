import { Record } from "./record";
import { Result } from "./result";

export class Team {
    name!: string;
    code!: string;
    image?: string;
    result!: Result;
    record!: Record;
    matchScore?: number;
}