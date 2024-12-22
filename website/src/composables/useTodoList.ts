import { ref, computed, Ref } from 'vue';
import { Filters, TodoItem, TodoLists } from '../types';
import { generateId } from '../utils';
import { useProvideInject } from './useProviderInject';
import { TodoItemNotFoundError } from '../utils/error';

const TODO_PROVIDER_SYMBOL = Symbol('TODO_PROVIDER_NAME')

function useTodoList (_todoLists: Ref<TodoLists>) {
    const filter = ref<Filters>(Filters.All);

    const todoLists = computed<TodoLists>(() => {
        if (filter.value === Filters.Active) return _todoLists.value.filter(todo => !todo.completed);
        if (filter.value === Filters.Completed) return _todoLists.value.filter(todo => todo.completed);
        return _todoLists.value;
    })

    function addNewTodo({ title }: Pick<TodoItem, 'title'>) {
        const newTodoItem: TodoItem = {
            id: generateId(),
            title,
            completed: false,
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

    function completeTodoItem(id: TodoItem['id'], isCompleted?: boolean) {
        const { todoItem, index } = findTodoItemById(id);
        console.log('completed', id);
        const updatedTodoItem: TodoItem = {
            id: todoItem.id,
            title: todoItem.title,
            completed: typeof isCompleted === 'undefined' ? !todoItem.completed : isCompleted,
        }

        _todoLists.value[index] = updatedTodoItem;
        console.log(_todoLists.value[index])
        return updatedTodoItem;
    }

    function clearCompletedTodos () {
        const unCompletedTodos = _todoLists.value.filter(todo => !todo.completed);
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
