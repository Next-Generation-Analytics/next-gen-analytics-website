<script lang="ts">
    import type { TeamMember } from '$lib/types/team';
    import TeamMemberCard from './TeamMember.svelte';
    import { fade } from 'svelte/transition';
    import { Plus } from 'lucide-svelte';

    export let members: TeamMember[];
    let selectedSpecialty: string | null = null;

    function handleSpecialtyClick(specialty: string) {
        if (selectedSpecialty === specialty) {
            selectedSpecialty = null;
        } else {
            selectedSpecialty = specialty;
        }
    }

    $: filteredMembers = selectedSpecialty 
        ? members.filter(member => member.specialties.includes(selectedSpecialty!))
        : members;
</script>

{#if selectedSpecialty}
    <div class="mb-4 p-2 bg-blue-50 rounded-lg flex items-center justify-between" transition:fade>
        <p class="text-blue-800">
            Showing team members specialized in: <span class="font-semibold">{selectedSpecialty}</span>
        </p>
        <button 
            class="text-blue-600 hover:text-blue-800"
            on:click={() => selectedSpecialty = null}
        >
            Clear filter
        </button>
    </div>
{/if}

<!-- Wrap the entire component in a container div -->
<div class="w-full py-4">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each filteredMembers as member (member.id)}
                <div class="max-w-sm">
                    <TeamMemberCard 
                        {member} 
                        onSpecialtyClick={handleSpecialtyClick}
                    />
                </div>
            {/each}

            {#if !selectedSpecialty}
                <div class="max-w-sm">
                    <div 
                        class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 group flex flex-col cursor-pointer"
                        on:click={() => window.location.href = 'mailto:sachskaren@gmail.com'}
                        on:keydown={(e) => e.key === 'Enter' && (window.location.href = 'mailto:sachskaren@gmail.com')}
                        tabindex="0"
                        role="link"
                        aria-label="Contact us about joining the team"
                    >
                        <div class="w-full h-72 bg-gray-100 flex items-center justify-center">
                            <Plus class="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        
                        <div class="p-3 flex flex-col flex-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-base font-semibold text-gray-900">Join Our Team</h3>
                                    <p class="text-blue-600 text-sm mb-1">Open Positions</p>
                                </div>
                            </div>

                            <div class="flex-1 mb-2 min-h-32">
                                <p class="text-gray-600 text-sm">
                                    We're always looking for talented individuals to join our team. If you're passionate about computational biology and data science, we'd love to hear from you.
                                </p>
                            </div>

                            <div class="mt-auto">
                                <div class="flex flex-wrap gap-1">
                                    <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs transition-colors group-hover:bg-blue-200 group-hover:text-blue-900">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
