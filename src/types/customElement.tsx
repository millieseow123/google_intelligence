import { BaseText } from 'slate'

export type CustomElement =
    | { type: 'paragraph'; children: CustomText[] }
    | { type: 'bulleted-list'; children: CustomText[] }
    | { type: 'block-quote'; children: CustomText[] }
    | { type: 'code-block'; children: CustomText[] }
    | { type: 'link'; url: string; children: CustomText[] }

export type CustomText = BaseText & {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
}