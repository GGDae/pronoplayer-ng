import { Match } from "./match";

export class PronoDay {
    date!: Date;
    day!: number;
    matchs?: Match[];
    finished!: boolean;
    show!: boolean;
}