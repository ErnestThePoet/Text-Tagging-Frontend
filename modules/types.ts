export interface CheckResult { ok: boolean; msg: string; }

export interface TagItemMeta {
    id: number;
    type: number;
    name: string;
}

export interface Task{
    id: number;
    name: string;
    targetTagsPerText: number;
    tagItemMetas: TagItemMeta[];
}

export interface TagItem{
    id: number;
    value: string[];
}

export interface Tag{
    id: number | null;

    textId: number;

    taggerName: string;
    tagTime: string;

    tagItems: Array<TagItem>;
}

export interface Text{
    id: number;
    uId: string;
    text: string;
    tag: Tag;
}