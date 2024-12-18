<script lang="ts">
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';
    import type { Node, Link } from '$lib/stores/graphStore';
    import type { HoverEvent } from '$lib/types/events';
    import type { D3DragEvent } from 'd3';
    import type { D3Node, D3Link } from '$lib/types/d3';

    export let nodes: Node[] = [];
    export let links: Link[] = [];

    const dispatch = createEventDispatcher<{
        hovered: HoverEvent;
        selected: Node;
    }>();

    let svg: SVGSVGElement;
    let simulation: d3.Simulation<D3Node, D3Link> | null = null;

    let hoveredNodeId: string | null = null;

    let isTransitioning = false;

    let resizeObserver: ResizeObserver;

    let previousNodes: Node[] = [];
    let previousLinks: Link[] = [];

    // Add new state variable for visibility
    let isStabilized = false;

    // Add these declarations
    let linkElements: d3.Selection<SVGPathElement, D3Link, SVGGElement, unknown>;
    let nodeElements: d3.Selection<SVGGElement, D3Node, SVGGElement, unknown>;

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

    // Add this near the top with other imports and declarations
    const drag = d3.drag<SVGGElement, D3Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
        
    function createRippleEffect(element: d3.Selection<any, any, any, any>, node: Node, width: number, onComplete?: () => void) {
        const radius = getNodeRadius(node, width);
        const nodeColor = node.group === 0 ? "#3b82f6" : node.group === 1 ? "#10b981" : "#f59e0b";
        
        const ripple = element.append('circle')
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', nodeColor)
            .attr('stroke-width', 6)
            .attr('opacity', 0.8)
            .style('filter', 'brightness(1.4) drop-shadow(0 0 4px ${nodeColor})');

        ripple.transition()
            .duration(200)
            .attr('r', radius * 1.5)
            .attr('opacity', 0)
            .ease(d3.easeExpOut)
            .on('end', function() {
                d3.select(this).remove();
                onComplete?.();
            });
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
        simulation = d3.forceSimulation<D3Node>(nodes as D3Node[])
            .force("link", d3.forceLink<D3Node, D3Link>(links as D3Link[])
                .id((d) => d.id)
                .distance((d) => {
                    const target = isNode(d.target) ? d.target : nodes.find(n => n.id === d.target);
                    if (!target) return Math.min(width, height) * 0.15;
                    
                    const minDimension = Math.min(width, height);
                    const scaleFactor = Math.min(0.15, 0.15 * (800 / minDimension));
                    return minDimension * (scaleFactor - target.group * 0.02);
                }))
            .force("charge", d3.forceManyBody<D3Node>()
                .strength(d => d.group === 0 ? -width * 2 : -width * 0.8))
            .force("radial", d3.forceRadial<D3Node>(
                d => (d.group * width * 0.15), 
                centerX, 
                centerY
            ).strength(1))
            .force("collision", d3.forceCollide<D3Node>()
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
            .attr("fill", "none") as d3.Selection<SVGPathElement, D3Link, SVGGElement, unknown>;

        // Create node group inside container
        const nodeGroup = graphContainer.append("g")
            .attr("class", "nodes");
            
        nodeElements = nodeGroup
            .selectAll<SVGGElement, D3Node>("g")
            .data(nodes as D3Node[])
            .join("g")
            .attr("class", "node")
            .style("cursor", "pointer")
            .call(drag)
            .on("click", function(event: MouseEvent, d: D3Node) {
                handleNodeClick(event, d);
            })
            .on("touchend", function(event: TouchEvent, d: D3Node) {
                handleNodeClick(event, d);
            })
            .on("pointerover", (event, d) => {
                if (!isDragging && event.pointerType !== 'touch') {
                    hoveredNodeId = d.id;
                    dispatch('hovered', { 
                        node: d,
                        position: { x: event.clientX, y: event.clientY }
                    });
                }
            })
            .on("pointerleave", (event) => {
                if (!isDragging && event.pointerType !== 'touch') {
                    hoveredNodeId = null;
                    dispatch('hovered', { 
                        node: null, 
                        position: { x: 0, y: 0 } 
                    });
                }
            });

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
            linkElements.attr("d", (d) => {
                const sourceNode = isNode(d.source) ? d.source : nodes.find(n => n.id === d.source);
                const targetNode = isNode(d.target) ? d.target : nodes.find(n => n.id === d.target);
                
                if (!sourceNode?.x || !sourceNode?.y || !targetNode?.x || !targetNode?.y) return '';
                
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
                return `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
            });

            nodeElements.attr("transform", (d) => {
                const x = d.x ?? 0;
                const y = d.y ?? 0;
                return `translate(${x},${y})`;
            });
        });
    }

    function handleNodeClick(event: MouseEvent | TouchEvent | D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
        if (event instanceof MouseEvent || event instanceof TouchEvent) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.sourceEvent.preventDefault();
            event.sourceEvent.stopPropagation();
        }

        if (isDragging) return;

        // Clear hover state immediately when clicked
        hoveredNodeId = null;

        // Get the clicked node element directly from the data
        const clickedNode = nodeElements.filter(node => node.id === d.id);
        
        if (!clickedNode.empty()) {
            // Create click animation
            clickedNode.select('circle')
                .transition()
                .duration(150)
                .attr('r', r => getNodeRadius(d, width) * 1.1)
                .transition()
                .duration(150)
                .attr('r', r => getNodeRadius(d, width));

            // Use the helper function
            createRippleEffect(clickedNode, d, width);

            // Delay the selection to let ripple animation play
            setTimeout(() => {
                dispatch('selected', d);
            }, 125);

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
    }

    function dragstarted(event: D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
        isDragging = false;
        dragStartPosition = { x: event.x, y: event.y };

        if (!event.active && simulation) {
            simulation.alphaTarget(0.3).restart();
        }
        
        if (typeof d.x === 'number') d.fx = d.x;
        if (typeof d.y === 'number') d.fy = d.y;
    }

    function dragged(event: D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
        // Check if we've moved enough to consider it a drag
        const dx = event.x - dragStartPosition.x;
        const dy = event.y - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > MOVE_THRESHOLD) {
            isDragging = true;
            // Clear hover state when dragging starts
            hoveredNodeId = null;
            dispatch('hovered', { 
                node: null, 
                position: { x: 0, y: 0 } 
            });
        }

        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
        if (!event.active) {
            simulation?.alphaTarget(0)
                .alpha(0.25)
                .alphaDecay(0.03);
        }

        // Only handle as click if we moved less than threshold
        const dx = event.x - dragStartPosition.x;
        const dy = event.y - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= MOVE_THRESHOLD) {
            handleNodeClick(event, d);
        }

        // For hub node, check if it's outside bounds and snap back if needed
        if (d.group === 0 && typeof d.x === 'number' && typeof d.y === 'number') {
            const padding = Math.min(width, height) * 0.15;
            const isOutOfBounds = 
                d.x < padding || 
                d.x > (width - padding) || 
                d.y < padding || 
                d.y > (height - padding);

            if (isOutOfBounds) {
                d.fx = null;
                d.fy = null;
            }
        } else {
            d.fx = null;
            d.fy = null;
        }

        isDragging = false;
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
                .attr('r', r => getNodeRadius(node, width) * 1.1)
                .transition()
                .duration(150)
                .attr('r', r => getNodeRadius(node, width));

            // Use the helper function with callback
            createRippleEffect(nodeElement, node, width, () => {
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













