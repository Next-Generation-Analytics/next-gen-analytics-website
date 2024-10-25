<script lang="ts">
	import { Info } from "lucide-svelte";

	// Remove x and y props since we're not using them anymore
	export let title: string;
	export let projectCount: number;
</script>

<div class="bg-white p-3 rounded-lg shadow-md max-w-xs">
	<h3 class="text-lg font-semibold mb-1">{title}</h3>
	<p class="text-sm text-gray-600 mb-2">{projectCount} specialties</p>
	<div class="flex items-center text-blue-600 text-sm">
		<Info class="w-4 h-4 mr-1" />
		Click node for details
	</div>
</div>
