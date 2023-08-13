import { User } from "./user";

export class PronoRanking {
    user?: User;
    score?: number;
    rank?: number;
    constructor(
        user: User,
        score: number | string,
    ){
        this.user = user;
        this.score = Number(score);
    }
}