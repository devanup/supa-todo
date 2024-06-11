'use client';
import { addTodo } from '@/app/todos/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { data } from 'autoprefixer';
import { Send } from 'lucide-react';
import { useRef } from 'react';

function FormContent() {
	return (
		<>
			<Textarea
				minLength={4}
				name='todo'
				required
				placeholder='Add a new todo'
			/>
			<Button type='submit' size='icon' className='min-w-10'>
				<Send className='h-5 w-5' />
				<span className='sr-only'>Submit Todo</span>
			</Button>
		</>
	);
}

export function TodoForm() {
	const formRef = useRef<HTMLFormElement>(null); // here we're creating a reference to the form element so we can clear the form after submission
	return (
		<Card>
			<CardContent className='p-3'>
				<form
					ref={formRef}
					action={async (data) => {
						// data is the form data that we're passing to the addTodo function. data comes from the form submission event
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
