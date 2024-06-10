'use client';
import { Button } from '@/components/ui/button';
import { Provider } from '@supabase/supabase-js';
import { GithubIcon } from 'lucide-react';
import { oAuthSignIn } from './actions';

type OAuthProvider = {
	name: Provider;
	displayName: string;
	icon?: JSX.Element;
}; // this allows us to use an array of OAuthProvider objects to render a list of buttons and we only have to define the provider name once

export function OAuthButtons() {
	const OAuthProviders: OAuthProvider[] = [
		{
			name: 'github',
			displayName: 'GitHub',
			icon: <GithubIcon className='size-5' />,
		},
	];
	return (
		<>
			{OAuthProviders.map((provider) => (
				<Button
					key={provider.name}
					variant='outline'
					className='w-full flex items-center justify-center gap-2'
					onClick={async () => {
						await oAuthSignIn(provider.name);
					}}
				>
					{provider.icon ?? null}
					Login with {provider.displayName}
				</Button>
			))}
		</>
	);
}
