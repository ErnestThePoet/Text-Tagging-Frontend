export interface TagItemMeta {
    id: number;
    type: number;
    name: string;
}

export interface Task {
    id: number;
    name: string;
    targetTagsPerText: number;
    tagItemMetas: TagItemMeta[];
}