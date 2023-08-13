import { Section } from "./section";

export interface Stage {
    name: string;
    slug: string;
    sections: Section[];
}