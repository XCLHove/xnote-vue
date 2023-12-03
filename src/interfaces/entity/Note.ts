import Keyword from "../../classes/Keyword.ts";

export interface Note {
    id: number,
    title: string,
    content: string,
    keywords: Keyword[],
    userId: number
}