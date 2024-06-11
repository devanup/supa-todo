'use client';
import { TodoItem } from './todo-item';
import { TodoForm } from './todo-form';
import { Todo } from '@/types/custom';
import { useOptimistic } from 'react';

export type Action = 'delete' | 'create' | 'update';
// We need to setup a reducer where we will call the actions
export function todoReducer(
	state: Array<Todo>,
	{ action, todo }: { action: Action; todo: Todo },
) {
	// todoReducer takes in the state array that contains the todos and an object with the action and todo
	// here we change the state input based on whatever the action is
	switch (action) {
		case 'delete':
			return state.filter(({ id }) => id !== todo.id); // return state list filtered to exclude the deleted id
		case 'update':
			return state.map((t) => (t.id === todo.id ? todo : t)); // return state list with the updated todo. If the todo id matches the todo id in the state list, return the updated todo / the one we passed, otherwise return the untouched todo
		case 'create':
			return [todo, ...state]; // return the new todo and the state list with the new todo at the beginning
		default:
			return state; // return the state list as is
	}
}

export type TodoOptimisticUpdate = (action: {
	action: Action;
	todo: Todo;
}) => void; // we will use this type to make sure we don't have to copy and paste it to different functions

export function TodoList({ todos }: { todos: Array<Todo> }) {
	const [optimistictodos, optimisticTodosUpdate] = useOptimistic(
		todos,
		todoReducer,
	);
	return (
		<>
			<TodoForm optimisticUpdate={optimisticTodosUpdate} />
			<div className='w-full flex flex-col gap-4'>
				{optimistictodos?.map((todo) => {
					return (
						<TodoItem
							todo={todo}
							key={todo.id}
							optimisticUpdate={optimisticTodosUpdate}
						/>
					);
				})}
			</div>
		</>
	);
}
