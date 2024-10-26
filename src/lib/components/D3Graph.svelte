<script lang="ts">
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';
    import type { Node, Link } from '$lib/stores/graphStore';
    import type { HoverEvent } from '$lib/types/events';

    export let nodes: Node[] = [];
    export let links: Link[] = [];

    const dispatch = createEventDispatcher<{
        hovered: HoverEvent;
        selected: Node;
    }>();

    let svg: SVGSVGElement;
    let simulation: d3.Simulation<Node, Link> | null = null;

    let hoveredNodeId: string | null = null;

    let isTransitioning = false;

    let resizeObserver: ResizeObserver;

    let previousNodes: Node[] = [];
    let previousLinks: Link[] = [];

    // Add new state variable for visibility
    let isStabilized = false;

    // Add these declarations
    let linkElements: d3.Selection<Element, Link, any, any>;
    let nodeElements: d3.Selection<Element, Node, any, any>;

    let width: number = 800;
    let height: number = 600;
    let centerX: number = width / 2;
    let centerY: number = height / 2;

    // Add variables to track drag state
    let isDragging = false;
    let dragStartPosition = { x: 0, y: 0 };
    const MOVE_THRESHOLD = 3; // pixels of movement to consider it a drag

    let isInitialLoad = true; // Flag to track initial load

    // Add at the top with other state variables
    let isVisible = false;

    // Add helper function at the top of the script
    function isNode(value: any): value is Node {
        return typeof value === 'object' && value !== null && 'id' in value;
    }

    function getNodeRadius(node: Node, containerWidth: number) {
        // Base sizes that scale with container width
        const baseSize = Math.min(containerWidth * 0.05, 65); // Cap at 65px
        return node.group === 0 
            ? Math.max(baseSize * 1.2, 48) // Ensure hub is larger, minimum 48px
            : Math.max(baseSize * 0.77, 40); // Minimum of 32px for readability
    }

    function getFontSize(node: Node, containerWidth: number) {
        // Base font size that scales with container width
        const baseFontSize = Math.min(containerWidth * 0.010, 12); // Cap at 12px
        return node.group === 0 
            ? Math.min(Math.max(baseFontSize * 1.2, 14), 16) // Hub text: min 14px, max 16px
            : Math.max(baseFontSize, 10); // Other nodes: minimum 10px
    }

    function getTextWrapWidth(node: Node, containerWidth: number) {
        // Text wrap width that scales with container width
        const baseWidth = Math.min(containerWidth * 0.08, 100); // Cap at 100px
        return node.group === 0 
            ? Math.min(baseWidth * 1.2, 100) // Hub text: max 100px width
            : Math.max(baseWidth * 0.75, 60); // Other nodes: minimum 60px
    }

    function initializeGraph() {
        if (!svg || !nodes.length || !links.length) return;

        isStabilized = false;
        const svgSelection = d3.select(svg);
        svgSelection.selectAll("*").remove();

        const boundingRect = svgSelection.node()?.getBoundingClientRect();
        width = boundingRect?.width || 800;
        height = boundingRect?.height || 600;
        centerX = width / 2;
        centerY = height / 2;

        // Reset hub node position to center
        const hubNode = nodes.find(n => n.group === 0);
        if (hubNode) {
            hubNode.x = centerX;
            hubNode.y = centerY;
            hubNode.fx = centerX;
            hubNode.fy = centerY;
        }

        // Update collision force to use responsive radius
        simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links)
                .id((d) => d.id)
                .distance((d) => {
                    // Ensure we're working with Node objects
                    const target = isNode(d.target) ? d.target : nodes.find(n => n.id === d.target);
                    if (!target) return width * 0.2;
                    return width * (0.2 - target.group * 0.03);
                }))
            .force("charge", d3.forceManyBody<Node>()
                .strength(d => d.group === 0 ? -width * 2 : -width * 0.8))
            .force("radial", d3.forceRadial<Node>(
                d => (d.group * width * 0.15), 
                centerX, 
                centerY
            ).strength(1))
            .force("collision", d3.forceCollide<Node>()
                .radius(d => getNodeRadius(d, width) + 5))
            .force("center", d3.forceCenter(centerX, centerY))
            .alphaMin(0.001)     
            .alphaDecay(0.05)    // Increased decay for faster settling
            .velocityDecay(0.4); // Increased decay for faster settling

        // Create container for all visual elements
        const graphContainer = svgSelection
            .append("g")
            .attr("class", "graph-container")
            .style("opacity", "0"); // Start invisible

        // Create link group inside container
        const linkGroup = graphContainer.append("g")
            .attr("class", "links");
            
        linkElements = linkGroup
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", "#64748b")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d) => Math.sqrt(d.value))
            .attr("fill", "none") as d3.Selection<Element, Link, any, any>;

        // Create node group inside container
        const nodeGroup = graphContainer.append("g")
            .attr("class", "nodes");
            
        nodeElements = nodeGroup
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("class", "node")
            .style("cursor", "pointer") as d3.Selection<Element, Node, any, any>;

        // Update circle sizes to be responsive
        nodeElements
            .append("circle")
            .attr("r", d => getNodeRadius(d, width))
            .attr("fill", (d) => d.group === 0 ? "#3b82f6" : d.group === 1 ? "#10b981" : "#f59e0b")
            .attr("fill-opacity", 0.9);

        // Update text sizing and wrapping to be responsive
        nodeElements
            .append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", d => `${getFontSize(d, width)}px`)
            .attr("font-weight", (d) => d.group === 0 ? "bold" : "normal")
            .each(function(d) {
                const text = d3.select(this);
                const words = d.id.split(' ');
                const fontSize = getFontSize(d, width);
                const lineHeight = fontSize * 1.2;
                const maxWidth = getTextWrapWidth(d, width);
                
                let line = '';
                let lineNumber = 0;
                const lines: string[] = [];
                
                words.forEach(word => {
                    const testLine = line + word + ' ';
                    text.text(testLine);
                    
                    const textNode = text.node();
                    const textLength = textNode?.getComputedTextLength() ?? 0;
                    
                    if (textLength > maxWidth && line.length > 0) { 
                        lines.push(line);
                        line = word + ' ';
                        lineNumber++;
                    } else {
                        line = testLine;
                    }
                });
                lines.push(line);
                
                text.text(null);
                
                lines.forEach((line, i) => {
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", i === 0 ? `-${(lines.length - 1) * lineHeight / 2}` : lineHeight)
                        .text(line.trim());
                });
            });

        // Create drag behavior
        const drag = d3.drag<any, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        nodeElements
            .call(drag)
            .on("mousedown", () => {
                isDragging = false;
                dragStartPosition = { x: 0, y: 0 };
            })
            .on("click", (event, d) => {
                if (!isDragging) {
                    handleNodeClick(event, d);
                }
            })
            .on("mouseenter", (event, d) => {
                hoveredNodeId = d.id;
                dispatch('hovered', { 
                    node: d,
                    position: { x: 0, y: 0 }
                });
            })
            .on("mouseleave", () => {
                hoveredNodeId = null;
                dispatch('hovered', { 
                    node: null, 
                    position: { x: 0, y: 0 } 
                });
            });

        // Add end event listener to simulation
        simulation.on("end", () => {
            // Only fade in if we're not in initial load or if resize has occurred
            if (isVisible) {
                graphContainer
                    .transition()
                    .duration(500)
                    .style("opacity", "1");
            }
        });

        // Optional: Force quick stabilization
        // Simulate multiple ticks rapidly
        for (let i = 0; i < 300; i++) {
            simulation.tick();
        }

        simulation.on("tick", () => {
            // Update positions
            linkElements.attr("d", (d: any) => {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
                return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
            });

            nodeElements.attr("transform", d => `translate(${d.x},${d.y})`);
        });
    }

    function handleNodeClick(event: any, d: Node) {
        if (isDragging) return;

        // Clear hover state immediately when clicked
        hoveredNodeId = null;
        dispatch('hovered', { 
            node: null, 
            position: { x: 0, y: 0 } 
        });

        // Find the clicked node's element
        const clickedNode = d3.select(event.currentTarget);
        
        // Create click animation
        clickedNode.select('circle')
            .transition()
            .duration(150)
            .attr('r', r => getNodeRadius(d, width) * 1.2)
            .transition()
            .duration(150)
            .attr('r', r => getNodeRadius(d, width));

        // Add ripple effect
        const radius = getNodeRadius(d, width);
        const ripple = clickedNode.append('circle')
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('opacity', 1);

        // Play ripple animation and dispatch event after it completes
        ripple.transition()
            .duration(200)
            .attr('r', radius * 1.1)
            .attr('opacity', 0)
            .on('end', function() {
                d3.select(this).remove();
                // Dispatch the selection event after animation
                dispatch('selected', d);
            });

        // Fix the connected nodes logic
        const connectedNodeIds = new Set(
            links
                .filter(link => {
                    const sourceId = isNode(link.source) ? link.source.id : link.source;
                    const targetId = isNode(link.target) ? link.target.id : link.target;
                    return sourceId === d.id || targetId === d.id;
                })
                .flatMap(link => {
                    const sourceId = isNode(link.source) ? link.source.id : link.source;
                    const targetId = isNode(link.target) ? link.target.id : link.target;
                    return [sourceId, targetId];
                })
        );

        // Temporarily fix positions of connected nodes
        nodes.forEach(node => {
            if (connectedNodeIds.has(node.id)) {
                node.fx = node.x;
                node.fy = node.y;
                
                setTimeout(() => {
                    if (node.group !== 0) { // Don't release hub node
                        node.fx = null;
                        node.fy = null;
                    }
                }, 500);
            }
        });
    }

    function dragstarted(event: any, d: any) {
        dragStartPosition = { x: event.x, y: event.y };
        isDragging = false;

        if (!event.active) simulation?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        // Check if we've moved enough to consider it a drag
        const dx = event.x - dragStartPosition.x;
        const dy = event.y - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > MOVE_THRESHOLD) {
            if (!isDragging && d.group !== 0) { // Don't modify link strengths for hub node
                // Only strengthen links when we first determine it's a drag
                isDragging = true;
                const linkForce = simulation?.force("link") as d3.ForceLink<Node, Link>;
                linkForce.strength((link: any) => {
                    if (link.source.id === d.id || link.target.id === d.id) {
                        return 1; // Stronger force for connected links
                    }
                    return 0.3; // Default force for other links
                });
            }
        }

        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) {
            simulation?.alphaTarget(0)
                .alpha(0.25)  // Reduced from 0.5 for gentler movement
                .alphaDecay(0.03);  // Reduced from 0.04 for slower settling
        }

        // For hub node, check if it's outside bounds and snap back if needed
        if (d.group === 0) {
            const padding = Math.min(width, height) * 0.15;
            const isOutOfBounds = 
                d.x < padding || 
                d.x > (width - padding) || 
                d.y < padding || 
                d.y > (height - padding);

            if (isOutOfBounds) {
                // Release fixed position to let it snap back
                d.fx = null;
                d.fy = null;
            }
        } else {
            d.fx = null;
            d.fy = null;
        }

        // Reset link strengths back to normal
        const linkForce = simulation?.force("link") as d3.ForceLink<Node, Link>;
        linkForce.strength((link: any) => 0.3);
    }

    async function handleResize() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Stop the simulation if it exists
        simulation?.stop();
        simulation = null;

        // Reinitialize graph
        initializeGraph();

        // Make graph visible after first resize
        isVisible = true;
        isTransitioning = false;
    }

    onMount(() => {
        // Don't initialize until we have a valid size
        if (svg && svg.clientWidth > 0) {
            initializeGraph();
        }
        isInitialLoad = false;

        // Create resize observer with debounced handler
        let resizeTimeout: NodeJS.Timeout;
        resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });
        
        if (svg) {
            resizeObserver.observe(svg);
        }
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        simulation?.stop();
    });

    afterUpdate(() => {
        if (isInitialLoad) return; // Skip if it's the initial load

        const nodesChanged = JSON.stringify(previousNodes) !== JSON.stringify(nodes);
        const linksChanged = JSON.stringify(previousLinks) !== JSON.stringify(links);
        
        if (nodesChanged || linksChanged) {
            previousNodes = [...nodes];
            previousLinks = [...links];
            initializeGraph();
        }
    });

    // Export a method to trigger node selection programmatically
    export function selectNode(nodeId: string) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Find the node element
        const nodeElement = nodeElements.filter(d => d.id === nodeId);
        if (!nodeElement.empty()) {
            // Clear hover state
            hoveredNodeId = null;
            dispatch('hovered', { 
                node: null, 
                position: { x: 0, y: 0 } 
            });

            // Create click animation
            nodeElement.select('circle')
                .transition()
                .duration(150)
                .attr('r', r => getNodeRadius(node, width) * 1.2)
                .transition()
                .duration(150)
                .attr('r', r => getNodeRadius(node, width));

            // Add ripple effect
            const radius = getNodeRadius(node, width);
            const ripple = nodeElement.append('circle')
                .attr('r', radius)
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .attr('opacity', 1);

            // Play ripple animation and dispatch event
            ripple.transition()
                .duration(200)
                .attr('r', radius * 1.1)
                .attr('opacity', 0)
                .on('end', function() {
                    d3.select(this).remove();
                    dispatch('selected', node);
                });
        }
    }
</script>

<div class="w-full h-full">
    <svg 
        bind:this={svg} 
        class="w-full h-full"
        style="opacity: {isVisible ? 1 : 0}; transition: opacity 200ms"
    ></svg>
</div>

<style>
    div {
        aspect-ratio: 16 / 9;
        max-height: 100%;
    }
</style>

