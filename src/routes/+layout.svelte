<script lang="ts">
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

	let vh: number;

	onMount(() => {
		// Set initial viewport height
		setViewportHeight();
		
		// Update viewport height when window resizes
		window.addEventListener('resize', setViewportHeight);
		
		// Clean up
		return () => {
			window.removeEventListener('resize', setViewportHeight);
		};
	});

	function setViewportHeight() {
		vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
</script>

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

<ParaglideJS {i18n}>
	<div class="flex flex-col min-h-screen">
		<Header />
		<main class="flex-1 w-full">
			{@render children()}
		</main>
		<Footer />
	</div>
</ParaglideJS>

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
