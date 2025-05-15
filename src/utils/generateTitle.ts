function generateTitleFromMessage(text: string): string {
    if (text.length > 40) return text.slice(0, 40) + '...';
    return text;
}
