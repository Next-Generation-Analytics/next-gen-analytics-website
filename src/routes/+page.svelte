<script lang="ts">
    import D3Graph from '$lib/components/D3Graph.svelte';
    import { nodes, links } from '$lib/stores/graphStore';
    import type { Node } from '$lib/stores/graphStore';
    import type { HoverEvent } from '$lib/types/events';
    import { ArrowRight } from 'lucide-svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Modal from '$lib/components/Modal.svelte';

    // Local state for hovered and selected nodes
    let hoveredNode: { node: Node | null, position: { x: number, y: number } } = { node: null, position: { x: 0, y: 0 } };
    let selectedNode: Node | null = null;

    // Wait for store data to be available before rendering D3Graph
    let graphData = {
        nodes: [] as typeof $nodes,
        links: [] as typeof $links
    };

    $: {
        if ($nodes.length > 0 && $links.length > 0) {
            graphData = {
                nodes: $nodes,
                links: $links
            };
        }
    }

    // Event handlers for D3Graph events
    function handleHovered(event: CustomEvent<HoverEvent>) {
        // Only update hover state if no node is selected
        if (!selectedNode) {
            hoveredNode = event.detail;
        }
    }

    function handleSelected(event: CustomEvent<Node>) {
        selectedNode = event.detail;
        // Clear hover state when a node is selected
        hoveredNode = { node: null, position: { x: 0, y: 0 } };
    }

    // Add this function to find and select the hub node
    function selectHubNode() {
        const hubNode = $nodes.find(node => node.group === 0);
        if (hubNode) {
            d3Graph.selectNode(hubNode.id);
        }
    }

    let d3Graph: D3Graph;  // Add this reference
</script>

<div class="relative flex flex-col">
    <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col pb-8" style="height: calc(100vh - 5rem);">
        <!-- Hero Section with bottom margin -->
        <div class="text-center pt-2 pb-8">
            <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Next Generation Analytics
            </h1>
            <p class="mt-3 text-md sm:text-lg max-w-xl mx-auto text-gray-500">
                Research and Consulting<br />— Systems and Computational Biology —
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                    on:click={selectHubNode}
                    class="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100">
                    Explore Our Services
                    <ArrowRight class="ml-2 h-5 w-5" />
                </button>
                <a data-sveltekit-preload-data="hover" href="/team" class="inline-flex items-center px-6 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100">
                    Meet Our Team
                </a>
            </div>
        </div>

        <!-- Graph Container -->
        <div class="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden relative min-h-0" 
             style="background-image: linear-gradient(#e5f3ff 1px, transparent 1px), linear-gradient(90deg, #e5f3ff 1px, transparent 1px); background-size: 20px 20px;">
            {#if graphData.nodes.length > 0 && graphData.links.length > 0}
                <D3Graph 
                    bind:this={d3Graph}
                    nodes={graphData.nodes} 
                    links={graphData.links} 
                    on:hovered={handleHovered}
                    on:selected={handleSelected}
                />
            {/if}

            {#if hoveredNode.node && !selectedNode}
                <div class="absolute top-4 right-4 z-10 pointer-events-none">
                    <Tooltip
                        title={hoveredNode.node.id}
                        projectCount={hoveredNode.node.projects.length}
                    />
                </div>
            {/if}

            {#if selectedNode}
                <Modal
                    title={selectedNode.id}
                    projects={selectedNode.projects}
                    on:close={() => selectedNode = null}
                />
            {/if}
        </div>
    </main>
</div>

<style>
    /* Optional: Add any additional styles if needed */
</style>
