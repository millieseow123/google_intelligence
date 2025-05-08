"use client"

import { Transforms, Element as SlateElement } from 'slate'
import { ReactEditor } from 'slate-react'

export const insertMention = (editor: ReactEditor, character: string) => {
    const mention = {
        type: 'mention',
        character,
        children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

export const withMentions = (editor: ReactEditor) => {
    const { isInline } = editor;
    editor.isInline = element => {
        return element.type === 'mention' ? true : isInline(element);
    };
    return editor;
};
