<template>
    <form @submit.prevent="onSubmit">
    <div class="pl-4 bg-[#fafafa] h-12 rounded-md">
        <label for="#todo-input" class="flex items-center w-full gap-2">
            <span class="circle"></span>
            <input v-model.lazy.trim="todoText" type="text" id="todo-input" :readonly="isDisabled" class="flex-1 bg-[#fafafa] border-none h-12 px-2 text-[#424242] outline-none" placeholder="Create a new todo...">
            <button class="text-4xl font-normal text-black border-none size-12 bg-inherit" :disabled="isDisabled">+</button>
        </label>
    </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MaybePromise, TodoItem } from '../types';
import { TodoTextEmptyError, UnfinishedActionError } from '../utils/error';
interface IProps {
    onSubmit: (todoItem: Pick<TodoItem, 'title'>) => MaybePromise<void>;
}
const props = defineProps<IProps>();

const todoText = ref('');
const isDisabled = ref(false);

function resetTodoText () {
    todoText.value = '';
}

function isValid() {
    if (!todoText.value.trim()) throw new TodoTextEmptyError(); 
    if (isDisabled.value) throw new UnfinishedActionError();
    
    return true;
}

async function onSubmit () {
    try {
        if (!isValid()) return;
        isDisabled.value = true;
        await props.onSubmit({ title: todoText.value });
        resetTodoText();
    } catch(err) {
        const message = err instanceof Error ? err.message : 'There is something wrong!! try again'
        alert(message);
    } finally {
        isDisabled.value = false;
    }

}
</script>

<style scoped>
.circle {
    @apply size-6 border-2 border-[#d2d3db] rounded-full;
}
</style>