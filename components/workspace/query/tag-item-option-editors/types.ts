import type { TagItemMeta } from "../../../../modules/objects/task";

export interface TagItemQueryOptionEditorProps {
    key: string | number;
    tagItemIndex: number;
    tagItemMeta: TagItemMeta;
}