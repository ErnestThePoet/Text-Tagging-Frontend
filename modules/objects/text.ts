export interface TagItem {
    id: number;
    value: string[];
}

export interface Tag {
    id: number | null;

    textId: number;

    taggerName: string;
    tagTime: string;

    tagItems: Array<TagItem>;
}

export interface Text{
    id: number;
    userId: string;
    fileName: string;
    text: string;
    tag: Tag;
}