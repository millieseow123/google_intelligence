import { Descendant } from 'slate'

export function convertToSlate(text: string): Descendant[] {
    if (!text) {
        return [
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ]
    }

    return text.split('\n').map(line => ({
        type: 'paragraph',
        children: [{ text: line }],
    }))
}
