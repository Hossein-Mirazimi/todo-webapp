export class TodoTextEmptyError extends Error {
    constructor(message = 'To-do text cannot be empty') {
        super(message);
        this.name = 'TodoTextEmptyError';
        this.stack = (new Error()).stack;
    }
}

export class TodoItemNotFoundError extends Error {
    constructor(message = 'Todo item not found') {
        super(message);
        this.name = 'TodoItemNotFoundError';
        this.stack = (new Error()).stack;
    }
}

export class UnfinishedActionError extends Error {
    constructor(message = 'Previous action has not finished yet. Please wait.') {
        super(message);
        this.name = 'UnfinishedActionError';
        this.stack = (new Error()).stack;
    }
}