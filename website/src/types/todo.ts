export interface TodoItem {
    title: string;
    completed: boolean;
    id: string;
}

export type TodoLists = TodoItem[];

export enum Filters {
    All = 'all',
    Active = 'active',
    Completed = 'completed'
}