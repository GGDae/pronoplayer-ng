import { User } from "./user";

export class PronoRanking {
    user?: User;
    score?: number;
    goodGuess!: number;
    totalGuess!: number;
    rank!: number;
    displayedRank!: number;
    constructor(
        user: User,
        score: number,
        goodGuess?: number,
        totalGuess?: number,
    ){
        this.user = user;
        this.score = Number(score);
        this.goodGuess = Number(goodGuess);
        this.totalGuess = Number(totalGuess);
    }
}