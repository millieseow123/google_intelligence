import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkSlate from 'remark-slate';
import type { Descendant } from 'slate';

export async function markdownToSlate(markdown: string): Promise<Descendant[]> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkSlate)
        .process(markdown);

    return file.result as Descendant[];
}
