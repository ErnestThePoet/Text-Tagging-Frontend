/*
    标注组件类型：
    单选->type=0, 系统数据库中类型:string[1], 导入文件中类型:string | number;
    复选->type=1, 系统数据库中类型:string[>=1], 导入文件中类型:string[];
    单输入框(可提供候选列表)->type=2, 系统数据库中类型:string[1], 导入文件中类型:(string | number)[1];
    输入框列表(可提供候选列表)->type=3, 系统数据库中类型:string[>=1], 导入文件中类型:Array<string|number>;
    位置选择框->type=4,string[2]
*/
export type TagItemType = 0 | 1 | 2 | 3 | 4;

// 选项仅对单选/多选有意义
export interface TagItemMetaChoice {
    external: string | number;
    internal?: string; // 没有internal代表该选择表示未标注，仅对单选有意义
    editorLabel?: string;
}

export interface TagItemMetaOption {
    allowDuplicate?: boolean;
    minCount?: number;
    maxCount?: number;
    // 仅对单输入/多输入有意义。长度为1时代表单输入元素需要为此类型，或多输入数组所有元素都需要为此类型，
    // 对于多输入，长度等于数组长度(minCount=== maxCount) 则数组对应下标处的元素需要为相应类型。
    type?: Array<"string" | "number">;
}

// 获取任务列表时，id, type, name由tasks.tagItemMetas提供，为MySQL数据库存储的内容；
// 其余属性由tagItemMetaDetailJsonStr属性提供，每个标注项由name属性标识。
export interface TagItemMeta {
    id: number;
    type: TagItemType;
    name: string;
    editorTitle: string;

    choices?: Array<TagItemMetaChoice>;
    options?: TagItemMetaOption;
}

export interface Task {
    id: number;
    name: string;
    targetTagsPerText: number;
    tagItemMetas: TagItemMeta[];
}