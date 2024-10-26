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
    let dialogElement: HTMLDialogElement;
    let isOpen = false;

    // Store the scroll position before locking
    let scrollPosition: number;

    function handleModalInteraction(e: MouseEvent | KeyboardEvent) {
        // Only handle interactions if modal is open
        if (!isOpen) return;

        // Handle click outside
        if (e.type === 'click') {
            const mouseEvent = e as MouseEvent;
            const clickedElement = mouseEvent.target as HTMLElement;
            
            // Only close if clicking directly on the dialog backdrop
            if (clickedElement === dialogElement) {
                close();
            }
        }
        
        // Handle escape key
        if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
            close();
        }
    }

    function close() {
        dispatch('close');
        closeModal();
    }

    function handleProjectClick(project: Project) {
        selectedProjectId = project.id;
        dispatch('select', { project });
    }

    function showModal() {
        isOpen = true;
        // Need to wait for dialog to be in DOM
        setTimeout(() => {
            dialogElement?.showModal();
        }, 0);
    }

    function closeModal() {
        isOpen = false;
        dialogElement?.close();
    }

    function lockScroll() {
        scrollPosition = window.scrollY;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('modal-open');
    }

    function unlockScroll() {
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
    }

    onMount(() => {
        showModal();
        document.addEventListener('keydown', handleModalInteraction);
        document.addEventListener('click', handleModalInteraction);
        lockScroll();
    });

    onDestroy(() => {
        document.removeEventListener('keydown', handleModalInteraction);
        document.removeEventListener('click', handleModalInteraction);
        unlockScroll();
    });
</script>

{#if isOpen}
    <dialog
        bind:this={dialogElement}
        class="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-4 md:p-0 bg-transparent w-full max-w-2xl fixed"
    >
        <div
            bind:this={modalContent}
            class="relative bg-white rounded-xl w-[calc(100%-2rem)] md:w-full mx-auto shadow-xl overflow-hidden"
            style="max-height: calc(var(--vh,1vh)*90);"
            role="document"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <!-- Modal header -->
            <div class="p-4 pb-0 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div class="flex justify-between items-center mb-6">
                    <h2 id="modal-title" class="text-2xl font-bold text-gray-900">{title}</h2>
                    <button
                        on:click={close}
                        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <svg class="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Updated scrollable content -->
            <div 
                class="pt-1 px-6 pb-6 overflow-y-scroll" 
                style="height: calc(var(--vh,1vh)*90 - 8rem);"
                id="modal-description"
            >
                <ul class="space-y-4">
                    {#each projects as project}
                        <li>
                            <button 
                                type="button"
                                class="w-full text-left bg-gray-50 p-5 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                on:click={() => handleProjectClick(project)}
                                aria-labelledby={`project-${project.id}-title`}
                                aria-describedby={`project-${project.id}-description`}
                                data-selected={selectedProjectId === project.id}
                            >
                                <h3 id={`project-${project.id}-title`} class="sm:text-xl text-lg font-semibold mb-2 text-blue-600">
                                    {project.title}
                                </h3>
                                <p 
                                    id={`project-${project.id}-description`} 
                                    class="text-gray-600 leading-relaxed sm:text-base text-sm"
                                >
                                    {project.description}
                                </p>
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </dialog>
{/if}

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

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    dialog {
        border: none;
        margin: 0;
        padding: 0;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-height: calc(var(--vh, 1vh) * 100);
        overscroll-behavior: none;
        touch-action: none;
    }

    dialog::backdrop {
        overscroll-behavior: none;
        touch-action: none;
    }

    :global(body.modal-open) {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
        touch-action: none;
    }

    /* Make sure modal content is scrollable */
    .overflow-y-scroll {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        touch-action: pan-y;
    }

    /* ... rest of your styles ... */
</style>
