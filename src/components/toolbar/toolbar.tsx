import React, { JSX } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { IconButton, Box, Divider } from '@mui/material'
import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, FormatListBulleted, FormatQuote, Code, AlternateEmail, Tag, Link as LinkIcon } from '@mui/icons-material'

import styles from './index.module.css'

const isMarkActive = (editor: any, format: string) => {
    const marks = editor.marks
    return marks ? marks[format] === true : false
}

const toggleMark = (editor: any, format: string) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
        editor.removeMark(format)
    } else {
        editor.addMark(format, true)
    }
}

const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && 'type' in n && n.type === format
    })
    return !!match
}

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format)
    Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : format } as Partial<SlateElement>,
        { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    )
}

const insertLink = (editor: Editor) => {
    const url = window.prompt('Enter the URL:')
    if (!url) return
    const { selection } = editor
    Transforms.insertNodes(editor, {
        type: 'link',
        url,
        children: [{ text: 'link' }]
    } as SlateElement)
}

const ToolbarButton = ({ icon, onClick, disabled }: { icon: JSX.Element, onClick: () => void, disabled?: boolean }) => (
    <IconButton
        onMouseDown={e => { e.preventDefault(); onClick() }}
        size="small"
        sx={{
            borderRadius: 2,
            padding: '6px',
            '&:hover': {
                bgcolor: '#f0f0f0'
            }
        }}
        disabled={disabled}
    >
        {icon}
    </IconButton>
)

const StaticToolbar = () => {
    const editor = useSlate();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: '#ffffffcc',
                mb: 1
            }}
        >
            <ToolbarButton icon={<FormatBold />} onClick={() => toggleMark(editor, 'bold')} />
            <ToolbarButton icon={<FormatItalic />} onClick={() => toggleMark(editor, 'italic')} />
            <ToolbarButton icon={<FormatUnderlined />} onClick={() => toggleMark(editor, 'underline')} />
            <ToolbarButton icon={<StrikethroughS />} onClick={() => toggleMark(editor, 'strikethrough')} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton icon={<FormatListBulleted />} onClick={() => toggleBlock(editor, 'bulleted-list')} />
            <ToolbarButton icon={<FormatQuote />} onClick={() => toggleBlock(editor, 'block-quote')} />
            <ToolbarButton icon={<Code />} onClick={() => toggleBlock(editor, 'code-block')} />
            <ToolbarButton icon={<LinkIcon />} onClick={() => insertLink(editor)} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton icon={<AlternateEmail />} onClick={() => { }} disabled />
            <ToolbarButton icon={<Tag />} onClick={() => { }} disabled />
        </Box>
    )
}


export default StaticToolbar
