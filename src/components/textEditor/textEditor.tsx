import React, { useCallback, useState } from 'react'
import { Descendant } from 'slate'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { Box, IconButton } from '@mui/material'
import { East } from '@mui/icons-material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import StaticToolbar from '../toolbar/toolbar'
import ActionButton from '../actionButton/actionButton'
import { toggleMark } from '@/utils/editorUtils'

import styles from './index.module.css'
import FilePreview from '../filePreview/filePreview'

interface TextEditorProps {
    value: Descendant[]
    editor: ReactEditor
    onChange: (newValue: Descendant[]) => void
    onSubmit: () => void
    uploadedFile: File | null
    onFileSelect: (file: File | null) => void
}

const renderLeaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    if (leaf.italic) {
        children = <em>{children}</em>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    if (leaf.strikethrough) {
        children = <s>{children}</s>
    }
    return <span {...attributes}>{children}</span>
}

const renderElement = ({ attributes, children, element }: any) => {
    const style = {
        textAlign: element.align || 'left',
        margin: 0,
    }

    switch (element.type) {
        case 'bulleted-list':
            return <ul {...attributes} style={{ margin: 0, paddingLeft: '1.5rem' }}><li>{children}</li></ul>
        case 'block-quote':
            return (
                <blockquote
                    {...attributes}
                    style={{
                        borderLeft: '4px solid #ccc',
                        paddingLeft: '1rem',
                        color: '#555',
                        fontStyle: 'italic',
                        margin: 0
                    }}
                >
                    {children}
                </blockquote>
            )
        case 'code-block':
            return <pre {...attributes} style={{ background: '#eee', padding: '0.5rem' }}><code>{children}</code></pre>
        case 'link':
            return (
                <a
                    {...attributes}
                    href={element.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'underline' }}
                >
                    {children}
                </a>
            )
        default:
            return <p {...attributes} style={style}>{children}</p>
    }
}

export default function TextEditor({ editor, value, onChange, onSubmit, uploadedFile, onFileSelect }: TextEditorProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFileSelect(files[0]);
        }
    };
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (event.shiftKey) {
                    return
                }

                event.preventDefault()
                onSubmit()
                setTimeout(() => ReactEditor.focus(editor), 0)
            }
            if (event.metaKey || event.ctrlKey) {
                switch (event.key.toLowerCase()) {
                    case 'b':
                        event.preventDefault()
                        toggleMark(editor, 'bold')
                        return
                    case 'i':
                        event.preventDefault()
                        toggleMark(editor, 'italic')
                        return
                    case 'u':
                        event.preventDefault()
                        toggleMark(editor, 'underline')
                        return
                    case 's':
                        event.preventDefault()
                        toggleMark(editor, 'strikethrough')
                        return
                }
            }
        },
        [onSubmit, editor]
    )

    return (
        <div className={styles.textEditor}>
            <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                {isDragging && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: '2px dashed #aaa',
                            backdropFilter: 'blur(1px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            zIndex: 5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <span style={{ fontSize: '1.1rem', color: '#333' }}>Drop file to upload</span>
                    </Box>
                )}
                <Slate key={JSON.stringify(value)} editor={editor} value={value} onChange={onChange}>
                    <StaticToolbar />
                    <Box
                        sx={{
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            bgcolor: 'white',
                            minHeight: '100px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        {uploadedFile && (
                            <FilePreview file={uploadedFile} onRemove={() => onFileSelect(null)} />
                        )}
                        <Editable
                            placeholder="What would you like to do today?"
                            onKeyDown={handleKeyDown}
                            renderLeaf={renderLeaf}
                            renderElement={renderElement}
                            style={{ outline: 'none', width: '100%', padding: '8px 0px' }}
                            className={styles.text}
                        />
                        <IconButton
                            color="primary"
                            onClick={onSubmit}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                bottom: 8,
                                zIndex: 2,
                                border: '2px solid #1e1e1e',
                                borderRadius: '50%',
                                padding: '4px',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <East sx={{ color: '#1e1e1e' }} />
                        </IconButton>

                        <Box
                            sx={{
                                gap: 1,
                                flexDirection: 'row',
                                display: 'flex',
                            }}
                        >
                            <ActionButton name="Attach file"
                                icon={<AttachFileIcon />}
                                onClick={() => document.getElementById('fileInput')?.click()} />
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) onFileSelect(file)
                                }}
                            />
                        </Box>
                    </Box>
                </Slate>
            </Box>
        </div>
    )
}
