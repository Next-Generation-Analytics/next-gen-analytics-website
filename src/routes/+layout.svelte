<script lang="ts">
	import '../app.css';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Background from '$lib/components/Background.svelte';
	import { dev } from '$app/environment';
	
	let { children } = $props();

	let error = $state<Error | null>(null);
	
	function handleError(e: Event) {
		if (e instanceof ErrorEvent) {
			error = e.error;
			if (dev) {
				console.error('Layout error:', e.error);
			}
		}
	}
</script>

<svelte:window onerror={handleError} />

<svelte:head>
	<title>Next Gen Analytics</title>
	<!-- iOS status bar style -->
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<!-- General theme color for light mode -->
	<meta name="theme-color" content="hsl(220, 25%, 97%)" media="(prefers-color-scheme: light)">
	<!-- General theme color for dark mode -->
	<meta name="theme-color" content="hsl(220, 25%, 9%)" media="(prefers-color-scheme: dark)">
</svelte:head>

<Background />

{#if error}
	<div class="flex min-h-screen items-center justify-center p-4">
		<div class="text-center">
			<h1 class="text-4xl font-bold mb-4">Something went wrong</h1>
			<p class="text-lg text-gray-600 mb-4">{error.message}</p>
			<button 
				class="text-blue-600 hover:underline"
				onclick={() => window.location.reload()}
			>
				Reload page
			</button>
		</div>
	</div>
{:else}
	<ParaglideJS {i18n}>
		<div class="flex flex-col min-h-screen">
			<Header />
			<main class="flex-1 w-full">
				{@render children()}
			</main>
			<Footer />
		</div>
	</ParaglideJS>
{/if}

<style>
	/* Add these styles */
	:global(:root) {
		height: 100%;
	}
	
	:global(body) {
		min-height: 100vh;
		/* Fallback */
		min-height: calc(var(--vh, 1vh) * 100);
		overflow-x: hidden;
	}
</style>
