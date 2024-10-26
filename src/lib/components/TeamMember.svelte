<script lang="ts">
    import type { TeamMember } from '$lib/types/team';  // Adjust import path as needed
    import { Linkedin, Twitter, Github } from 'lucide-svelte';

    export let member: TeamMember;
    export let onSpecialtyClick: (specialty: string) => void;
</script>

<div class="w-90 h-[100%] bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 group flex flex-col">
    <img 
        src={member.image} 
        alt={member.name}
        class="w-full h-72 object-cover object-center bg-gray-50"
    />
    <div class="p-3 flex flex-col flex-1">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="text-base font-semibold text-gray-900">{member.name}</h3>
                <p class="text-blue-600 text-sm mb-1">{member.role}</p>
            </div>
            {#if member.social}
                <div class="flex space-x-2 mt-1 gap-4">
                    {#if member.social.linkedin}
                        <a href={member.social.linkedin} class="text-gray-400 hover:text-blue-600" target="_blank">
                            <Linkedin class="w-8 h-8 sm:w-6 sm:h-6" />
                        </a>
                    {/if}
                    {#if member.social.twitter}
                        <a href={member.social.twitter} class="text-gray-400 hover:text-blue-600" target="_blank">
                            <Twitter class="w-8 h-8 sm:w-6 sm:h-6" />
                        </a>
                    {/if}
                    {#if member.social.github}
                        <a href={member.social.github} class="text-gray-400 hover:text-gray-900" target="_blank">
                            <Github class="w-8 h-8 sm:w-6 sm:h-6" />
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
        
        <div class="flex-1 mb-2 min-h-32">
            <p class="text-gray-600 text-sm">{member.bio}</p>
        </div>

        <div class="mt-auto">
            <div class="flex flex-wrap gap-1">
                {#each member.specialties as specialty}
                    <button 
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs transition-colors 
                               group-hover:bg-blue-200 group-hover:text-blue-900 hover:bg-blue-300 cursor-pointer"
                        on:click={() => onSpecialtyClick(specialty)}
                    >
                        {specialty}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
</style>
