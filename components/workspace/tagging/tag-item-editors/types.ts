import type { TagItemMeta } from "../../../../modules/objects/task";

export interface TagItemEditorProps {
    key: string | number;
    textIndex: number;
    tagItemIndex: number; // 直接额外提供文本对象中的标注项下标，避免在编辑框组件中通过tagItemMeta多次查找
    tagItemMeta: TagItemMeta;
}