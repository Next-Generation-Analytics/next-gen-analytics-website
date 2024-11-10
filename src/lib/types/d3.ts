import type { Simulation, SimulationNodeDatum } from 'd3';
import type { Node, Link } from '$lib/stores/graphStore';

// Extend SimulationNodeDatum to include our Node properties
export interface D3Node extends Node, SimulationNodeDatum {
    x?: number;
    y?: number;
    fx: number | null;
    fy: number | null;
}

// Create a new interface for D3 links instead of extending Link
export interface D3Link {
    source: D3Node | string;
    target: D3Node | string;
    value: number;
}

export type D3Simulation = Simulation<D3Node, D3Link>; 