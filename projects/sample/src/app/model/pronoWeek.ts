import { PronoDay } from "./pronoDay";

export class PronoWeek {
    id!: string;
    competitionId?: string;
    block!: string;
    startDate!: Date;
    lockDate!: Date;
    endDate!: Date;
    pronoDays!: PronoDay[];
}