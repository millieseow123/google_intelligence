import React, { useRef, useState } from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { Box, Divider, Select, MenuItem, Tooltip } from '@mui/material'
import { FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, FormatListBulleted, FormatQuote, Code, AlternateEmail, Tag, Link as LinkIcon } from '@mui/icons-material'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import ToolbarButton from '../toolbarButton/toolbarButton';
import { CustomElement, MarkFormat, ParagraphElement } from '@/types/customElement'
import Popup from '../popup/popup'
import { CONSTANTS } from '@/constants/text'
import { ALIGN } from '@/types/align'

import styles from './index.module.css'

interface StaticToolbarProps {
    contacts: { name: string; email: string }[]
}

export default function StaticToolbar({ contacts }: StaticToolbarProps) {
    const editor = useSlate();
    const mentionButtonRef = useRef<HTMLButtonElement>(null)
    const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
    const [mentionAnchor, setMentionAnchor] = useState<HTMLElement | null>(null)
    const [isMentionOpen, setIsMentionOpen] = useState(false)
    const [mentionSearch, setMentionSearch] = useState('')
    const linkButtonRef = useRef<HTMLButtonElement>(null)
    const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null)
    const [isLinkOpen, setIsLinkOpen] = useState(false)

    const isMarkActive = (editor: Editor, format: MarkFormat) => {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    }

    const toggleMark = (editor: Editor, format: MarkFormat) => {
        const isActive = isMarkActive(editor, format)

        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    }


    const isBlockActive = (editor: Editor, format: string) => {
        const [match] = Editor.nodes<CustomElement>(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && typeof (n as any).type === 'string' &&
                (n as CustomElement).type === format,
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

    const getCurrentAlignment = () => {
        const [match] = Editor.nodes<CustomElement>(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                typeof (n as any).type === 'string' &&
                (n as CustomElement).type === 'paragraph',
        });

        if (match) {
            const [element] = match;
            if (SlateElement.isElement(element) && element.type === 'paragraph') {
                return element.align || ALIGN.LEFT;
            }
        }

        return 'left';
    };

    const getAlignIcon = (align: string) => {
        switch (align) {
            case 'center': return <FormatAlignCenterIcon fontSize="small" />
            case 'right': return <FormatAlignRightIcon fontSize="small" />
            case 'justify': return <FormatAlignJustifyIcon fontSize="small" />
            case 'left':
            default:
                return <FormatAlignLeftIcon fontSize="small" />
        }
    }

    const setAlignment = (editor: Editor, align: string) => {
        const [match] = Editor.nodes<CustomElement>(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) && typeof (n as any).type === 'string' &&
                (n as CustomElement).type === 'paragraph',
        })

        if (match) {
            Transforms.setNodes(
                editor,
                { align } as Partial<ParagraphElement>,
                {
                    match: n =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        typeof (n as any).type === 'string' &&
                        (n as CustomElement).type === 'paragraph',
                }
            )
        }
    }

    const handleLinkClick = (el: HTMLElement | null) => {
        if (!el) return
        setLinkAnchor(el)
        setIsLinkOpen(true)
    }

    const handleMentionClick = (el: HTMLElement | null) => {
        if (!el) return
        setMentionAnchor(el)
        setIsMentionOpen(true)
    }
    const filteredContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(mentionSearch.toLowerCase())
    )
    const insertMention = (name: string, email: string) => {
        const mentionNode = {
            type: 'mention',
            name,
            email,
            children: [{ text: '' }],
        }

        Transforms.insertNodes(editor, mentionNode)
        Transforms.move(editor)
        ReactEditor.focus(editor)
    }

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
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.BOLD} icon={<FormatBold />} onClick={() => toggleMark(editor, 'bold')} isActive={isMarkActive(editor, 'bold')} />
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.ITALIC} icon={<FormatItalic />} onClick={() => toggleMark(editor, 'italic')} isActive={isMarkActive(editor, 'italic')} />
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.UNDERLINE} icon={<FormatUnderlined />} onClick={() => toggleMark(editor, 'underline')} isActive={isMarkActive(editor, 'underline')} />
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.STRIKETHROUGH} icon={<StrikethroughS />} onClick={() => toggleMark(editor, 'strikethrough')} isActive={isMarkActive(editor, 'strikethrough')} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.BULLETS} icon={<FormatListBulleted />} onClick={() => toggleBlock(editor, 'bulleted-list')} isActive={isBlockActive(editor, 'bulleted-list')} />
            <Tooltip title={CONSTANTS.TOOLTIP.ALIGN} disableHoverListener={isAlignMenuOpen}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        value={getCurrentAlignment()}
                        size="small"
                        variant="standard"
                        disableUnderline
                        onOpen={() => setIsAlignMenuOpen(true)}
                        onClose={() => setIsAlignMenuOpen(false)}
                        onChange={(e) => setAlignment(editor, e.target.value)}
                        renderValue={() => getAlignIcon(getCurrentAlignment())}
                        sx={{
                            '&:hover': {
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#f0f0f0',
                                },
                            },
                            '& .MuiSelect-select': {
                                padding: '6px 0 0 0',
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
            </Tooltip>
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.QUOTE} icon={<FormatQuote />} onClick={() => toggleBlock(editor, 'block-quote')} />
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.CODE} icon={<Code />} onClick={() => toggleBlock(editor, 'code-block')} />
            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.LINK} icon={<LinkIcon />} buttonRef={linkButtonRef} onClick={() => { if (linkButtonRef.current) handleLinkClick(linkButtonRef.current) }} />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <ToolbarButton tooltip={CONSTANTS.TOOLTIP.MENTION} icon={<AlternateEmail />} buttonRef={mentionButtonRef} onClick={() => {
                if (mentionButtonRef.current) handleMentionClick(mentionButtonRef.current)
            }} />


            <Popup open={isMentionOpen} anchorEl={mentionAnchor} onClose={() => {
                setIsMentionOpen(false)
                setMentionSearch('')
            }}>
                <Box sx={{ p: 1, width: 220 }}>
                    <input
                        type="text"
                        placeholder={CONSTANTS.PLACEHOLDERS.CONTACT}
                        value={mentionSearch}
                        onChange={(e) => setMentionSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            backgroundColor: '#fff',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            color: '#1e1e1e',
                        }}
                    />
                    <Box
                        sx={{
                            maxHeight: 150,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        {filteredContacts.map((contact) => (
                            <Box
                                key={contact.email}
                                onClick={() => {
                                    insertMention(contact.name, contact.email)
                                    setIsMentionOpen(false)
                                }}
                                sx={{
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    color: '#1e1e1e',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}
                            >
                                {contact.name} ({contact.email})
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Popup>


            <Popup open={isLinkOpen} anchorEl={linkAnchor} onClose={() => setIsLinkOpen(false)}>
                <Box sx={{ p: 1, borderRadius: '8px' }}>
                    <input
                        type="text"
                        placeholder="Insert link"
                        style={{
                            width: '200px',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            backgroundColor: '#fff',
                            color: '#1e1e1e',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const url = (e.target as HTMLInputElement).value
                                if (url) {
                                    Transforms.insertNodes(editor, {
                                        type: 'link',
                                        url,
                                        children: [{ text: url }]
                                    })
                                    setIsLinkOpen(false)
                                }
                            }
                        }}
                    />
                </Box>
            </Popup>

        </Box>

    )
}
