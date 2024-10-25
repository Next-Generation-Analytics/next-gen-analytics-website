import type { Node } from '$lib/stores/graphStore';

export interface HoverEvent {
    node: Node | null;
    position: {
        x: number;
        y: number;
    };
}

export interface SelectEvent {
    node: Node;
}
