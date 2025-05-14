import { CustomElement } from '@/types/customElement'
import { Descendant, Text } from 'slate'

export function slateToMarkdown(nodes: Descendant[]): string {
    return nodes.map(serializeNode).join('\n\n')
}

function serializeNode(node: Descendant): string {
    if (Text.isText(node)) {
        let text = node.text
        if (node.bold) text = `**${text}**`
        if (node.italic) text = `*${text}*`
        if (node.underline) text = `<u>${text}</u>`
        if (node.strikethrough) text = `~~${text}~~`
        return text
    }

    if ('type' in node) {
        const element = node as CustomElement

        switch (node.type) {
            case 'paragraph':
                return node.children.map(serializeNode).join('')

            case 'bulleted-list':
                return node.children.map(child => `- ${serializeNode(child)}`).join('\n')

            case 'block-quote':
                return '> ' + node.children.map(serializeNode).join(' ')

            case 'code-block':
                return '```\n' + node.children.map(serializeNode).join('') + '\n```'

            case 'link':
                return `[${node.children.map(serializeNode).join('')}](${node.url})`

            case 'mention':
                return `@${(node as any).name}`
            
            // TODO: Add support for files

            default:
                return element.children?.map(serializeNode).join('') || ''
        }
    }

    return ''
}
