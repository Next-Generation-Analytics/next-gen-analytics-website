<!-- src/lib/components/Background.svelte -->
<script lang="ts">
	import { browser } from "$app/environment";
	import { spring } from 'svelte/motion';

	// Keep original spring parameters
	const scrollSpring = spring(0, {
		stiffness: 0.03,
		damping: 0.35
	});
	
	let prefersReducedMotion = false;

	if (browser) {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		
		window.addEventListener('scroll', () => {
			if (!prefersReducedMotion) {
				scrollSpring.set(window.scrollY * 1);  // Keep original multiplier
			}
		});
	}
</script>

<div class="background-wrapper">
	<div class="background-gradient" />
	<div class="background-container">
		<!-- Large circles with much larger movement values -->
		<div class="circle circle-1" 
			style="transform: rotate({$scrollSpring * 0.5}deg) scale({1 + $scrollSpring * 0.002}) 
			translateX({Math.sin($scrollSpring * 0.05) * 50}px)" />
		<div class="circle circle-2" 
			style="transform: rotate({$scrollSpring * -0.4}deg) scale({1 + $scrollSpring * 0.0025}) 
			translateX({Math.sin($scrollSpring * 0.04) * -60}px)" />
		<div class="circle circle-3" 
			style="transform: rotate({$scrollSpring * 0.3}deg) scale({1 + $scrollSpring * 0.003}) 
			translateX({Math.sin($scrollSpring * 0.03) * 40}px)" />
		
		<!-- Medium circles with increased movement -->
		<div class="circle circle-4" 
			style="transform: rotate({$scrollSpring * -0.4}deg) translateY({Math.sin($scrollSpring * 0.04) * 10}px)" />
		<div class="circle circle-5" 
			style="transform: rotate({$scrollSpring * 0.5}deg) translateY({Math.sin($scrollSpring * 0.03) * -15}px)" />
		<div class="circle circle-6" 
			style="transform: rotate({$scrollSpring * -0.4}deg) translateY({Math.sin($scrollSpring * 0.04) * 20}px)" />
		
		<!-- Small circles with faster orbital movement -->
		<div class="circle circle-7" 
			style="transform: rotate({$scrollSpring * 0.04}deg) translateX({Math.sin($scrollSpring * 0.02) * 15}px)" />
		<div class="circle circle-8" 
			style="transform: rotate({$scrollSpring * -0.045}deg) translateX({Math.sin($scrollSpring * 0.025) * 12}px)" />
		<div class="circle circle-9" 
			style="transform: rotate({$scrollSpring * 0.05}deg) translateX({Math.sin($scrollSpring * 0.03) * 10}px)" />
		<div class="circle circle-10" 
			style="transform: rotate({$scrollSpring * -0.06}deg) translateX({Math.sin($scrollSpring * 0.035) * 8}px)" />
			
		<!-- New medium circle for left side -->
		<div class="circle circle-11" 
			style="transform: rotate({$scrollSpring * 0.45}deg) translateY({Math.sin($scrollSpring * 0.035) * 18}px)" />
			
		<!-- New small circles for left side -->
		<div class="circle circle-12" 
			style="transform: rotate({$scrollSpring * -0.055}deg) translateX({Math.sin($scrollSpring * 0.028) * 11}px)" />
		<div class="circle circle-13" 
			style="transform: rotate({$scrollSpring * 0.048}deg) translateX({Math.sin($scrollSpring * 0.022) * 13}px)" />
		<div class="circle circle-14" 
			style="transform: rotate({$scrollSpring * -0.052}deg) translateX({Math.sin($scrollSpring * 0.032) * 9}px)" />
	</div>
</div>

<style>
	/* Base background styles */
	.background-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
	}

	/* Updated gradient for better circle visibility */
	.background-gradient {
		position: absolute;
		width: 100%;
		height: 100%;
		background: 
			/* Added shimmer gradient */
			linear-gradient(
				45deg,
				transparent 0%,
				hsla(220, 59%, 70%, 0.05) 25%,
				transparent 50%,
				hsla(190, 90%, 70%, 0.05) 75%,
				transparent 100%
			),
			/* Existing gradients */
			radial-gradient(
				circle at 80% 20%,
				hsla(220, 59%, 70%, 0.05),
				transparent
			),
			linear-gradient(
				45deg,
				transparent 0%,
				hsla(190, 90%, 70%, 0.05) 100%
			),
			linear-gradient(
				hsl(220, 25%, 97%),
				hsl(220, 25%, 97%)
			);
		background-size: 400% 400%, 100% 100%, 100% 100%, 100% 100%;
		animation: shimmer 15s linear infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 200%, 0 0, 0 0, 0 0;
		}
		100% {
			background-position: -200% -200%, 0 0, 0 0, 0 0;
		}
	}

	/* Circle container */
	.background-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
		will-change: transform, opacity;
		transform-origin: center center;
	}

	/* Large blurred circles - keeping previous values */
	.circle-1 {
		width: 900px;
		height: 900px;
		background: hsla(220, 59%, 50%, 0.15);
		top: -40%;
		left: -20%;
		filter: blur(70px);
	}

	.circle-2 {
		width: 800px;
		height: 800px;
		background: hsla(190, 90%, 50%, 0.25);
		bottom: -40%;
		right: -25%;
		filter: blur(60px);
	}

	.circle-3 {
		width: 700px;
		height: 700px;
		background: hsla(200, 75%, 55%, 0.2);
		top: 60%;
		left: -15%;
		filter: blur(50px);
	}

	/* Medium outlined circles - slight reduction in opacity */
	.circle-4 {
		width: 400px;
		height: 400px;
		border: 3px solid hsla(220, 59%, 50%, 0.25);
		top: 10%;
		right: -5%;
	}

	.circle-5 {
		width: 300px;
		height: 300px;
		border: 3px solid hsla(190, 90%, 50%, 0.25);
		bottom: 15%;
		left: -8%;
	}

	.circle-6 {
		width: 350px;
		height: 350px;
		border: 3px solid hsla(200, 75%, 55%, 0.25);
		top: -10%;
		left: 25%;
	}

	/* Small outlined circles - slight reduction in opacity */
	.circle-7 {
		width: 150px;
		height: 150px;
		border: 2px solid hsla(220, 59%, 50%, 0.2);
		top: 85%;
		right: 15%;
	}

	.circle-8 {
		width: 120px;
		height: 120px;
		border: 2px solid hsla(190, 90%, 50%, 0.2);
		top: 5%;
		left: 8%;
	}

	.circle-9 {
		width: 100px;
		height: 100px;
		border: 2px solid hsla(200, 75%, 55%, 0.2);
		bottom: 25%;
		right: 8%;
	}

	.circle-10 {
		width: 80px;
		height: 80px;
		border: 2px solid hsla(220, 59%, 50%, 0.2);
		top: 40%;
		right: -2%;
	}

	/* Dark mode styles */
	:global(.dark) .background-gradient {
		background: 
			radial-gradient(
				circle at 80% 20%,
				hsla(220, 59%, 70%, 0.05),
				transparent
			),
			linear-gradient(
				45deg,
				transparent 0%,
				hsla(190, 90%, 70%, 0.05) 100%
			),
			linear-gradient(
				hsl(220, 25%, 9%),
				hsl(220, 25%, 9%)
			);
	}

	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
			.background-gradient {
				animation: none;
			}
			
			.circle, .background-container {
				transform: none !important;
				transition: none !important;
			}
	}

	/* Update transition for background gradient */
	.background-gradient {
		transition: background 0.4s ease-out;
		/* Faster shimmer animation */
		animation: shimmer 12s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%, 100% {
			background-position: 200% 200%, 
		}
		50% {
			background-position: -200% -200%, 0 0, 0 0, 0 0;
			filter: saturate(130%);
		}
	}

	/* New medium circle */
	.circle-11 {
		width: 320px;
		height: 320px;
		border: 3px solid hsla(210, 80%, 50%, 0.15);
		top: 26%;
		right: 18%;
	}

	/* New small circles */
	.circle-12 {
		width: 140px;
		height: 140px;
		border: 2px solid hsla(200, 75%, 55%, 0.2);
		top: 15%;
		left: 22%;
	}

	.circle-13 {
		width: 110px;
		height: 110px;
		border: 2px solid hsla(190, 90%, 50%, 0.2);
		bottom: 35%;
		left: 18%;
	}

	.circle-14 {
		width: 90px;
		height: 90px;
		border: 2px solid hsla(220, 59%, 50%, 0.2);
		top: 35%;
		left: 5%;
	}
</style>
