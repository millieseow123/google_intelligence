import React from 'react'
import { Descendant, Text,Element as SlateElement } from 'slate'

export const renderSlateContent = (nodes: Descendant[]) => {
    return nodes.map((node, i) => {
        if (Text.isText(node)) {
            let text = <>{node.text}</>

            if (node.bold) text = <strong>{text}</strong>
            if (node.italic) text = <em>{text}</em>
            if (node.underline) text = <u>{text}</u>
            if (node.strikethrough) text = <s>{text}</s>

            return <span key={i}>{text}</span>
        }

        if ('type' in node) {
            switch (node.type) {
                case 'paragraph':
                    return (
                        <div key={i} style={{ lineHeight: 1.8, }}>
                            {renderSlateContent(node.children)}
                        </div>
                    )
                case 'bulleted-list':
                    return (
                        <ul key={i}>
                            {node.children.map((child, j) => (
                                <li key={j}>{renderSlateContent([child])}</li>
                            ))}
                        </ul>
                    )
                case 'block-quote':
                    return (
                        <blockquote key={i} style={{ fontStyle: 'italic', paddingLeft: '1rem', borderLeft: '4px solid #ccc' }}>
                            {renderSlateContent(node.children)}
                        </blockquote>
                    )
                case 'code-block':
                    return (
                        <pre key={i} style={{ background: '#eee', padding: '0.5rem' }}>
                            <code>{renderSlateContent(node.children)}</code>
                        </pre>
                    )
                case 'link':
                    return (
                        <a key={i} href={node.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                            {renderSlateContent(node.children)}
                        </a>
                    )
                case 'mention':
                    return (
                        <span
                            key={i}
                            style={{
                                padding: '2px 6px',
                                margin: '0 2px',
                                backgroundColor: '#e0f7fa',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                display: 'inline-block',
                                verticalAlign: 'baseline',
                            }}
                        >
                            @{(node as any).name}
                        </span>
                    )
                default:
                    if (SlateElement.isElement(node)) {
                        const element = node as SlateElement
                        return <div key={i}>{renderSlateContent(element.children)}</div>
                    }
            }
        }

        return null
    })
}
