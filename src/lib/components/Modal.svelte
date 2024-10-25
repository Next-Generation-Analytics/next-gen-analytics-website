<!-- src/lib/components/Modal.svelte -->
<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import type { Project } from '$lib/stores/graphStore';

    export let title: string;
    export let projects: Project[];

    const dispatch = createEventDispatcher();
    let modalContent: HTMLDivElement;
    let selectedProjectId: string | null = null;

    // Close on escape key
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') close();
    }

    // Close if clicking outside the modal
    function handleOutsideClick(e: MouseEvent) {
        if (modalContent && !modalContent.contains(e.target as Node)) {
            close();
        }
    }

    function close() {
        dispatch('close');
    }

    function handleProjectClick(project: Project) {
        selectedProjectId = project.id;
        dispatch('select', { project });
    }

    onMount(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);
    });

    onDestroy(() => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleKeydown);
    });
</script>

<!-- Backdrop with animation -->
<div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    on:click={handleOutsideClick}
    on:keydown={(e) => e.key === 'Escape' && close()}
    aria-label="Close modal"
    role="presentation"
    tabindex="-1"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
>
    <!-- Modal container with animation -->
    <div
        bind:this={modalContent}
        class="bg-white rounded-xl max-w-2xl w-full shadow-xl overflow-hidden"
        in:scale={{ duration: 200, start: 0.95 }}
        out:scale={{ duration: 150, start: 1 }}
        aria-modal="true"
        role="dialog"
        on:click|stopPropagation
    >
        <!-- Header (fixed) -->
        <div class="p-6 pb-0 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div class="flex justify-between items-center mb-6">
                <h2 id="modal-title" class="text-2xl font-bold text-gray-900">{title}</h2>
                <button
                    on:click={close}
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Scrollable content -->
        <div class="pt-1 px-6 pb-6 max-h-[calc(90vh-8rem)] overflow-y-auto" id="modal-description">
            <ul class="space-y-4">
                {#each projects as project}
                    <li>
                        <button 
                            type="button"
                            class="w-full text-left bg-gray-50 p-5 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            on:click={() => handleProjectClick(project)}
                            on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project)}
                            aria-selected={selectedProjectId === project.id}
                            aria-labelledby={`project-${project.id}-title`}
                            aria-describedby={`project-${project.id}-description`}
                        >
                            <h3 id={`project-${project.id}-title`} class="text-xl font-semibold mb-2 text-blue-600">
                                {project.title}
                            </h3>
                            <p 
                                id={`project-${project.id}-description`} 
                                class="text-gray-600 leading-relaxed"
                            >
                                {project.description}
                            </p>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    /* Custom scrollbar for webkit browsers */
    div::-webkit-scrollbar {
        width: 8px;
    }

    div::-webkit-scrollbar-track {
        background: transparent;
    }

    div::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
    }

    div::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
    }
</style>
