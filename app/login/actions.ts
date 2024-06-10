'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function emailLogin(formData: FormData) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect('/login?message=Could not authenticate user');
	}

	revalidatePath('/', 'layout');
	redirect('/todos');
}

export async function signup(formData: FormData) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect('/login?message=Error signing up user');
	}

	revalidatePath('/', 'layout');
	redirect(
		'/login?message=Account created. Please check your email to verify your account',
	);
}

export async function signOut() {
	const supabase = createClient();

	await supabase.auth.signOut();

	// revalidatePath('/', 'layout');
	redirect('/login');
}
