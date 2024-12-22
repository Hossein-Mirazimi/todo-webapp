import { TodoLists } from "src/types";
import { endpoint } from "./endpoint";

export const fetchAllTodoApi = endpoint<void, TodoLists>((client) => client.get('/todos')); 