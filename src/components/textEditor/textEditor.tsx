"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Range,
    Descendant,
    Editor,
    Element as SlateElement,
    Text,
    Transforms,
} from "slate";
import { Slate, Editable, ReactEditor } from "slate-react";
import { Box, Tooltip } from "@mui/material";
import { useQuery } from "@apollo/client";
import { ArrowForward, Mic, Stop } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import StaticToolbar from "../toolbar/toolbar";
import IconTextButton from "../iconTextButton/iconTextButton";
import FilePreview from "../filePreview/filePreview";
import RoundIconButton from "../roundIconButton/roundIconButton";
import { toggleMark } from "@/utils/editorUtils";
import { Element } from "slate";
import { CONSTANTS } from "@/constants/text";
import { GET_USERS } from "@/hooks/useGetUsers";

import styles from "./index.module.css";

interface TextEditorProps {
    value: Descendant[];
    editor: ReactEditor;
    onChange: (newValue: Descendant[]) => void;
    onSubmit: () => void;
    isGenerating: boolean;
    onStop: () => void;
    voiceInput: VoiceInputProps;
    fileUpload: FileUploadProps;
}

export interface VoiceInputProps {
    transcript: string;
    listening: boolean;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export interface FileUploadProps {
    uploadedFile: File | null;
    onFileSelect: (file: File | null) => void;
}

// To render the text with different styles based on the marks applied
const renderLeaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    if (leaf.strikethrough) {
        children = <s>{children}</s>;
    }
    return <span {...attributes}>{children}</span>;
};

// To render formatted text in the editor
const renderElement = ({ attributes, children, element }: any) => {
    const style = {
        textAlign: element.align || "left",
        margin: 0,
    };

    switch (element.type) {
        case "bulleted-list":
            return (
                <ul {...attributes} style={{ margin: 0, paddingLeft: "1.5rem" }}>
                    <li>{children}</li>
                </ul>
            );
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "block-quote":
            return (
                <blockquote
                    {...attributes}
                    style={{
                        borderLeft: "4px solid #ccc",
                        paddingLeft: "1rem",
                        color: "#555",
                        fontStyle: "italic",
                        margin: 0,
                    }}
                >
                    {children}
                </blockquote>
            );
        case "code-block":
            return (
                <pre {...attributes} style={{ background: "#eee", padding: "0.5rem" }}>
                    <code>{children}</code>
                </pre>
            );
        case "link":
            return (
                <a
                    {...attributes}
                    href={element.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                    {children}
                </a>
            );
        case "mention":
            return (
                <span
                    {...attributes}
                    contentEditable={false}
                    style={{
                        padding: "2px 6px",
                        margin: "0 2px",
                        backgroundColor: "#e0f7fa",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        display: "inline-block",
                        verticalAlign: "baseline",
                    }}
                >
                    @{element.name}
                    {children}
                </span>
            );
        default:
            return (
                <p {...attributes} style={style}>
                    {children}
                </p>
            );
    }
};

export default function TextEditor({
    editor,
    value,
    onChange,
    onSubmit,
    fileUpload,
    isGenerating,
    onStop,
    voiceInput,
}: TextEditorProps) {
    const [isDragging, setIsDragging] = useState(false);
    const {
        transcript,
        listening,
        startListening,
        stopListening,
        resetTranscript,
    } = voiceInput;
    const { uploadedFile, onFileSelect } = fileUpload;
    const [target] = useState<Range | null>(null);
    const [search] = useState("");
    const { data } = useQuery(GET_USERS);
    const contacts = data?.getUsers || [];
    const filteredContacts = contacts.filter((c: { name: string }) =>
        c.name.toLowerCase().startsWith(search.toLowerCase())
    );
    const [lastTranscript, setLastTranscript] = useState("");

    function hasContent(nodes: Descendant[]): boolean {
        const hasText = nodes.some((node) => {
            if (Text.isText(node)) {
                return node.text.trim() !== "";
            }

            if (SlateElement.isElement(node) && node.type === "mention") {
                return true;
            }

            if ("children" in node) {
                return hasContent(node.children);
            }

            return false;
        });

        return hasText || !!uploadedFile;
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

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
            if (event.key === "Enter") {
                if (event.shiftKey) {
                    return;
                }

                event.preventDefault();
                onSubmit();
                setTimeout(() => ReactEditor.focus(editor), 0);
            }
            if (event.metaKey || event.ctrlKey) {
                switch (event.key.toLowerCase()) {
                    case "b":
                        event.preventDefault();
                        toggleMark(editor, "bold");
                        return;
                    case "i":
                        event.preventDefault();
                        toggleMark(editor, "italic");
                        return;
                    case "u":
                        event.preventDefault();
                        toggleMark(editor, "underline");
                        return;
                    case "s":
                        event.preventDefault();
                        toggleMark(editor, "strikethrough");
                        return;
                }
            }
            if (event.key === "Backspace") {
                const { selection } = editor;

                if (selection && Range.isCollapsed(selection)) {
                    const listItemMatch = Editor.above(editor, {
                        match: (n) =>
                            SlateElement.isElement(n) && n.type === "bulleted-list",
                    });

                    if (listItemMatch) {
                        const [listItemNode, listItemPath] = listItemMatch;

                        const isEmpty = Editor.isEmpty(editor, listItemNode);
                        const start = Editor.start(editor, listItemPath);

                        if (isEmpty && Editor.isStart(editor, selection.anchor, start)) {
                            event.preventDefault();

                            // Reset the current node to a paragraph
                            Transforms.setNodes(
                                editor,
                                { type: "paragraph" },
                                {
                                    at: listItemPath,
                                    match: (n) =>
                                        SlateElement.isElement(n) && n.type === "bulleted-list",
                                }
                            );

                            // Unwrap the list to remove the bullet point
                            Transforms.unwrapNodes(editor, {
                                at: listItemPath,
                                match: (n) =>
                                    SlateElement.isElement(n) && n.type === "bulleted-list",
                            });

                            return;
                        }
                    }
                }
            }
        },
        [onSubmit, editor]
    );

    // Append only the new portion of the voice transcript to the editor content
    useEffect(() => {
        if (transcript && transcript !== lastTranscript) {
            const newText = transcript.slice(lastTranscript.length);
            let currentText = "";

            if (Element.isElement(value[0])) {
                currentText = value[0].children?.[0]?.text || "";
            }
            onChange([
                {
                    type: "paragraph",
                    children: [{ text: currentText + newText }],
                },
            ]);

            setLastTranscript(transcript);
        }
    }, [transcript]);

    // Reset the transcript if the editor is empty to avoid stale voice input
    useEffect(() => {
        const isEditorEmpty =
            value.length === 1 &&
            Element.isElement(value[0]) &&
            value[0].type === "paragraph" &&
            value[0].children?.[0]?.text === "";

        if (isEditorEmpty) {
            resetTranscript();
        }
    }, [value]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Position dropdown near the text cursor when a target is set.
    useEffect(() => {
        if (target && dropdownRef.current) {
            const domRange = ReactEditor.toDOMRange(editor, target);
            const rect = domRange.getBoundingClientRect();
            const el = dropdownRef.current;

            el.style.top = `${rect.top + window.scrollY + 24}px`;
            el.style.left = `${rect.left + window.scrollX}px`;
        }
    }, [target, editor]);

    return (
        <div className={styles.textEditor}>
            <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {isDragging && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "2px dashed #aaa",
                            backdropFilter: "blur(1px)",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            zIndex: 5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <span style={{ fontSize: "1.1rem", color: "#333" }}>
                            {CONSTANTS.PLACEHOLDERS.UPLOAD}
                        </span>
                    </Box>
                )}
                <Slate
                    key={JSON.stringify(value)}
                    editor={editor}
                    value={value}
                    onChange={(newValue) => onChange(newValue)}
                >
                    <StaticToolbar contacts={filteredContacts} />
                    <Box
                        sx={{
                            padding: "12px",
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            bgcolor: "white",
                            minHeight: "100px",
                            maxHeight: "260px",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        {uploadedFile && (
                            <FilePreview
                                file={uploadedFile}
                                onRemove={() => onFileSelect(null)}
                            />
                        )}
                        {!uploadedFile &&
                            SlateElement.isElement(editor.children[0]) &&
                            Editor.isEmpty(editor, editor.children[0]) &&
                            editor.children.length === 1 &&
                            Text.isText(editor.children[0].children?.[0]) && (
                                <div
                                    style={{
                                        position: "absolute",
                                        color: "#aaa",
                                        pointerEvents: "none",
                                        padding: "8px 0",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {CONSTANTS.PLACEHOLDERS.EDITOR}
                                </div>
                            )}
                        <Box
                            sx={{
                                maxHeight: "160px",
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#ccc",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <Editable
                                onKeyDown={handleKeyDown}
                                renderLeaf={renderLeaf}
                                renderElement={renderElement}
                                style={{ outline: "none", width: "100%", padding: "8px 0px" }}
                                className={styles.text}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1,
                                position: "relative",
                            }}
                        >
                            <Tooltip title={CONSTANTS.TOOLTIP.ATTACH}>
                                <Box>
                                    <IconTextButton
                                        name="Attach file"
                                        icon={<AttachFileIcon />}
                                        onClick={() =>
                                            document.getElementById("fileInput")?.click()
                                        }
                                    />
                                    <input
                                        id="fileInput"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) onFileSelect(file);
                                        }}
                                    />
                                </Box>
                            </Tooltip>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title={CONSTANTS.TOOLTIP.VOICE}>
                                    <RoundIconButton
                                        onClick={listening ? stopListening : startListening}
                                        icon={listening ? <Stop fontSize="small" /> : <Mic fontSize="small" />}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: '#f0f0f0',
                                            color: '#333',
                                            border: '1px solid #ccc',
                                            '&:hover': {
                                                bgcolor: '#e0e0e0',
                                            },
                                        }}
                                    />
                                </Tooltip>
                                <RoundIconButton
                                    onClick={isGenerating ? onStop : onSubmit}
                                    icon={
                                        isGenerating ? <Stop fontSize="small" /> : <ArrowForward fontSize="small" />
                                    }
                                    disabled={
                                        !isGenerating &&
                                        !hasContent(value)
                                    }
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        padding: '4px',
                                        '&.Mui-disabled': {
                                            borderColor: '#f0f0f0',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                    </Box>
                </Slate>
            </Box >
        </div >
    )
}
