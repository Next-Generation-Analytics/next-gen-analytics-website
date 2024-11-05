<!-- src/routes/team/+page.svelte -->
<script lang="ts">
    import TeamGrid from '$lib/components/TeamGrid.svelte';
    import { teamMembers } from '$lib/data/team';
</script>

<div class="min-h-[calc(100vh-5rem)] flex flex-col w-full max-w-7xl mx-auto px-4 mb-2 sm:px-6 lg:px-8 pb-2">
    <div class="text-center small:mb-12 small:mt-0 mt-4 mb-6">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Team
        </h1>
        <p class="mt-4 text-xl text-gray-500">
            Meet the experts shaping next-gen solutions in computational biology.
        </p>
    </div>

    <TeamGrid members={teamMembers} />
    <div class="flex-grow"></div>
</div>
