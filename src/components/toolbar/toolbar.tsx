import React, { JSX } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { IconButton, Box, Divider, Select, MenuItem, Tooltip } from '@mui/material'
import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, FormatListBulleted, FormatQuote, Code, AlternateEmail, Tag, Link as LinkIcon } from '@mui/icons-material'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import ToolbarButton from '../toolbarButton/toolbarButton';

import styles from './index.module.css'
import { CustomElement } from '@/types/customElement'

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
    const [match] = Editor.nodes<CustomElement>(editor, {
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

const setAlignment = (editor: Editor, align: string) => {
    const [match] = Editor.nodes<CustomElement>(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === 'paragraph',
    })

    if (match) {
        Transforms.setNodes(
            editor,
            { align },
            {
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n.type === 'paragraph',
            }
        )
    }
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
            <ToolbarButton tooltip="Bold" icon={<FormatBold />} onClick={() => toggleMark(editor, 'bold')} />
            <ToolbarButton tooltip="Italic" icon={<FormatItalic />} onClick={() => toggleMark(editor, 'italic')} />
            <ToolbarButton tooltip="Underline" icon={<FormatUnderlined />} onClick={() => toggleMark(editor, 'underline')} />
            <ToolbarButton tooltip="Strikethrough" icon={<StrikethroughS />} onClick={() => toggleMark(editor, 'strikethrough')} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton tooltip="Bullets" icon={<FormatListBulleted />} onClick={() => toggleBlock(editor, 'bulleted-list')} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Select
                    defaultValue="left"
                    size="small"
                    variant="standard"
                    disableUnderline
                    onChange={(e) => setAlignment(editor, e.target.value)}
                    sx={{
                        minWidth: 50, height: 36, '&:hover': {
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: '#f0f0f0',
                            },
                        }, '& .MuiSelect-select': {
                            display: 'flex', alignItems: 'center', paddingBottom: '0',
                            paddingLeft: '8px',
                        }
                    }}
                >
                    <MenuItem value="left">
                        <FormatAlignLeftIcon fontSize="small" />
                    </MenuItem>
                    <MenuItem value="center">
                        <FormatAlignCenterIcon fontSize="small" />
                    </MenuItem>
                    <MenuItem value="right">
                        <FormatAlignRightIcon fontSize="small" />
                    </MenuItem>
                    <MenuItem value="justify">
                        <FormatAlignJustifyIcon fontSize="small" />
                    </MenuItem>
                </Select>
            </Box>
            <ToolbarButton tooltip="Quote" icon={<FormatQuote />} onClick={() => toggleBlock(editor, 'block-quote')} />
            <ToolbarButton tooltip="Insert code block" icon={<Code />} onClick={() => toggleBlock(editor, 'code-block')} />
            <ToolbarButton tooltip="Insert link" icon={<LinkIcon />} onClick={() => insertLink(editor)} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton tooltip="Mention" icon={<AlternateEmail />} onClick={() => { }} disabled />
            <ToolbarButton tooltip="Hash" icon={<Tag />} onClick={() => { }} disabled />
        </Box>
    )
}


export default StaticToolbar
