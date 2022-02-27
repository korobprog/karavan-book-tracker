import { Sheet } from "use-google-sheets/dist/types";

export type Book = {
    id: string;
    name: string;
    short_name: string;
    category: string;
    points?: string; 
}

export const getBooks = (data: Sheet[]) => {
    if (!data[0]) {
        return [];
    }
    return data[0].data as Book[];
}
