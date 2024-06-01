import { DiscordConfig } from "./discord-config";

export interface Group {
    id: string;
    name: string;
    isPublic: boolean;
    administrators: string[];
    competitions: string[];
    discord: DiscordConfig;
}