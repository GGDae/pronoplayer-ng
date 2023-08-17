import { Badge } from "./badge";
import { Group } from "./group";

export interface User {
    id: string;
    userId: string;
    login: string;
    admin: boolean;
    displayName?: string;
    favouriteTeam?: string;
    profileImageUrl?: string;
    groups?: Group[];
    badges?: Badge[];
}