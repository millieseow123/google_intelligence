import React from 'react'
import { Descendant, Text } from 'slate'

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
                        <div key={i} style={{ marginBottom: '8px' }}>
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
                default:
                    return <div key={i}>{renderSlateContent(node.children)}</div>
            }
        }

        return null
    })
}
