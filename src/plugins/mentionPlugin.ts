"use client"

import { ReactEditor } from 'slate-react'

export const withMentions = (editor: ReactEditor) => {
    editor.isInline = element => element.type === 'mention'
    return editor;
};
