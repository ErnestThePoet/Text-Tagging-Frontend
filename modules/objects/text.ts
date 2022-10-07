import { makeAutoObservable } from "mobx";

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
    text: string;
    tag: Tag;
}