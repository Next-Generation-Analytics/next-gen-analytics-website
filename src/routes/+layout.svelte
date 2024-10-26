<script lang="ts">
	export const prerender = true;

	import '../app.css';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Background from '$lib/components/Background.svelte';
	
	let { children } = $props();

	// Check if we're on the team page using $derived instead of $:
	const isTeamPage = $derived($page.url.pathname === '/team');

	onMount(() => {
		// Apply the 'dark' class to the <html> element for dark mode
		// document.documentElement.classList.add('dark');
	});
</script>

<svelte:head>
	<title>Next Gen Analytics</title>
</svelte:head>

<Background />

<ParaglideJS {i18n}>
	<div class="flex flex-col min-h-screen">
		<Header showHomeLink={isTeamPage} />
		<main class="flex-1 w-full">
			{@render children()}
		</main>
		<Footer />
	</div>
</ParaglideJS>
