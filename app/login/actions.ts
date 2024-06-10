'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';

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

export async function oAuthSignIn(provider: Provider) {
	if (!provider) {
		redirect('/login?message=No provider found');
	}
	const supabase = createClient();
	const redirectURL = getURL('/auth/callback'); // to pass to the provider for redirection after authentication
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: redirectURL,
		},
	});
	if (error) {
		redirect('/login?message=Could not authenticate user');
	}
	return redirect(data.url); // redirect to the provider's authentication page to complete the sign-in and then redirect back to the app
}
