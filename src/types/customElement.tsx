import { BaseText } from 'slate'
import { ALIGN } from './align';

export type CustomElement =
    | ParagraphElement
    | BulletedListElement
    | BlockQuoteElement
    | CodeBlockElement
    | LinkElement
    | MentionElement

export type MarkFormat = 'bold' | 'italic' | 'underline' | 'strikethrough'

export type CustomText = BaseText & {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
}
export interface ParagraphElement {
    type: 'paragraph'
    align?: ALIGN.LEFT | ALIGN.CENTER | ALIGN.RIGHT | ALIGN.JUSTIFY
    children: CustomText[]
}

export interface ParagraphElement {
    type: 'paragraph'
    align?: ALIGN
    children: CustomText[]
}

export interface BulletedListElement {
    type: 'bulleted-list'
    children: CustomText[]
}

export interface BlockQuoteElement {
    type: 'block-quote'
    children: CustomText[]
}

export interface CodeBlockElement {
    type: 'code-block'
    children: CustomText[]
}

export interface LinkElement {
    type: 'link'
    url: string
    children: CustomText[]
}

export type MentionElement = {
    type: 'mention'
    name: string
    email: string
    children: [{ text: '' }]
}