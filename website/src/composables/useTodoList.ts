import { ref, computed } from 'vue';
import { Filters, TodoItem, TodoLists } from '../types';
import { generateId } from '../utils';
import { useStorage } from '@vueuse/core'
import { useProvideInject } from './useProviderInject';
import { TodoItemNotFoundError } from '../utils/error';

const TODO_STORAGE_KEY = 'todo_cache'

const TODO_PROVIDER_SYMBOL = Symbol('TODO_PROVIDER_NAME')

function useTodoList () {
    const _todoLists = useStorage<TodoLists>(TODO_STORAGE_KEY, [], sessionStorage);
    const filter = ref<Filters>(Filters.All);

    const todoLists = computed<TodoLists>(() => {
        if (filter.value === Filters.Active) return _todoLists.value.filter(todo => !todo.checked);
        if (filter.value === Filters.Completed) return _todoLists.value.filter(todo => todo.checked);
        return _todoLists.value;
    })

    function addNewTodo({ text }: Pick<TodoItem, 'text'>) {
        const newTodoItem: TodoItem = {
            id: generateId(),
            text,
            checked: false,
            createdAt: new Date().getDate(),
        }
        
        _todoLists.value.push(newTodoItem)
    }

    function deleteTodoById(id: TodoItem['id']) {
        const { todoItem, index } = findTodoItemById(id)

        _todoLists.value.splice(index, 1)

        return todoItem;
    }

    function findTodoItemById(id: TodoItem['id']) {
        const todoIndex = _todoLists.value.findIndex((todo) => todo.id === id);
        if (todoIndex === -1) throw new TodoItemNotFoundError();

        return {
            todoItem: _todoLists.value[todoIndex],
            index: todoIndex,
        };
    }

    function completeTodoItem(id: TodoItem['id'], isChecked?: boolean) {
        const { todoItem, index } = findTodoItemById(id);
        console.log('completed', id);
        const updatedTodoItem: TodoItem = {
            id: todoItem.id,
            text: todoItem.text,
            checked: typeof isChecked === 'undefined' ? !todoItem.checked : isChecked,
            createdAt: todoItem.createdAt
        }

        _todoLists.value[index] = updatedTodoItem;
        console.log(_todoLists.value[index])
        return updatedTodoItem;
    }

    function clearCompletedTodos () {
        const unCompletedTodos = _todoLists.value.filter(todo => !todo.checked);
        if (unCompletedTodos.length === _todoLists.value.length) return;

        _todoLists.value = [...unCompletedTodos]
    }

    return {
        todoLists,
        filter,
        addNewTodo,
        deleteTodoById,
        completeTodoItem,
        clearCompletedTodos,
    }
}

export const {
    injectCtx: useTodoListContext,
    provideCtx: useTodoListProvider,
} = useProvideInject(TODO_PROVIDER_SYMBOL, useTodoList)
