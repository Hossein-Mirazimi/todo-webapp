export interface TodoItem {
    text: string;
    checked: boolean;
    id: string;
    readonly createdAt: number;
}

export type TodoLists = TodoItem[];

export enum Filters {
    All = 'all',
    Active = 'active',
    Completed = 'completed'
}