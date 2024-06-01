import { PronoDay } from "./pronoDay";

export class PronoWeek {
    id!: string;
    competitionId?: string;
    block!: string;
    lockDate!: Date;
    pronoDays!: PronoDay[];
}