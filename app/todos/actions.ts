'use server';
import { Todo } from '@/types/custom';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
	const supabase = createClient();
	const text = formData.get('todo') as string | null; // here we're getting the value of the 'todo' key from the form data and casting it to a string or null if it's not a string

	if (!text) {
		throw new Error('Please enter a todo'); // if the text is null, we throw an error
	}

	const {
		data: { user },
	} = await supabase.auth.getUser(); // here we're getting the user from the supabase client because we need the user's id to associate the todo with the user

	if (!user) {
		throw new Error('User is not logged in');
	}

	const { error } = await supabase.from('todos').insert([
		{
			task: text,
			user_id: user.id,
		},
	]); // here we're inserting the todo into the todos table in the database and capturing any errors that may occur during the insert

	if (error) {
		throw new Error('Error adding task');
	}

	revalidatePath('/todos');
}

export async function deleteTodo(id: number) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('User is not logged in');
	}

	const { error } = await supabase.from('todos').delete().match({
		user_id: user.id,
		id: id,
	});

	if (error) {
		throw new Error('Error deleting task');
	}

	revalidatePath('/todos');
}

export async function updateTodo(todo: Todo) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('User is not logged in');
	}

	const { error } = await supabase.from('todos').update(todo).match({
		user_id: user.id,
		id: todo.id,
	});

	if (error) {
		throw new Error('Error updating task');
	}

	revalidatePath('/todos');
}
