'use client';
import { addTodo } from '@/app/todos/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { data } from 'autoprefixer';
import { Send } from 'lucide-react';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { TodoOptimisticUpdate } from './todo-list';
import { Todo } from '@/types/custom';

function FormContent() {
	const { pending } = useFormStatus();
	return (
		<>
			<Textarea
				disabled={pending}
				minLength={4}
				name='todo'
				required
				placeholder='Add a new todo'
			/>
			<Button type='submit' size='icon' className='min-w-10' disabled={pending}>
				<Send className='h-5 w-5' />
				<span className='sr-only'>Submit Todo</span>
			</Button>
		</>
	);
}

export function TodoForm({
	optimisticUpdate,
}: {
	optimisticUpdate: TodoOptimisticUpdate;
}) {
	const formRef = useRef<HTMLFormElement>(null); // here we're creating a reference to the form element so we can clear the form after submission
	return (
		<Card>
			<CardContent className='p-3'>
				<form
					ref={formRef}
					action={async (data) => {
						// data is the form data that we're passing to the addTodo function. data comes from the form submission event
						const newTodo: Todo = {
							id: -1, // we're setting the id to -1 because we don't have the id yet, so it's a placeholder
							inserted_at: '',
							user_id: '',
							task: data.get('todo') as string, // we're getting the todo from the form data
							is_complete: false,
						};
						optimisticUpdate({ action: 'create', todo: newTodo }); // we're calling the optimisticUpdate function with the action 'create' and the data from the form submission
						await addTodo(data);
						formRef.current?.reset();
					}}
					className='flex gap-4'
				>
					<FormContent />
				</form>
			</CardContent>
		</Card>
	);
}
