import { Sender } from "@/types/chat";

export const initialHistory = [
    {
        id: '1',
        title: 'Draft email for leave',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        messages: [
            {
                sender: Sender.USER,
                text: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Hey, can you write an email for leave?' }],
                    },
                ],
            },
            {
                sender: Sender.BOT,
                text: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: `Sure, I’ve updated the email. Here’s the revised draft:\n` +
                                    `Subject: Request for Leave\n` +
                                    `Dear [Manager’s Name],\n` +
                                    `I hope this email finds you well. I am writing to formally request leave from [start date] to [end date] due to medical reasons.\n` +
                                    `I will ensure that all my responsibilities are handled before my leave, and I am happy to assist in any transition or handover process required.\n` +
                                    `Thank you for considering my request. Please let me know if you need any additional information.\n` +
                                    `Best regards,\n` +
                                    `[Your Name]`
                            },
                        ],
                    },
                ],
            },
            {
                sender: Sender.USER,
                text: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Can you change the reason to "medical reasons"?' }],
                    },
                ],
            },
            {
                sender: Sender.BOT,
                text: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Sure, I’ve updated the email. Here’s the revised draft:' +
                                    `Subject: Request for Leave\n` +
                                    `Dear [Manager’s Name],\n` +
                                    `I hope this email finds you well. I am writing to formally request leave from [start date] to [end date] due to medical reasons.\n` +
                                    `I will ensure that all my responsibilities are handled before my leave, and I am happy to assist in any transition or handover process required.\n` +
                                    `Thank you for considering my request. Please let me know if you need any additional information.\n` +
                                    `Best regards,\n` +
                                    `[Your Name]`
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        title: 'Follow-up reply',
        createdAt: new Date().toISOString(), // today
        messages: [
            {
                sender: Sender.USER,
                text: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'How to respond if boss says no?' }],
                    },
                ],
            },
            {
                sender: Sender.BOT,
                text: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'You can respond politely by saying: "I understand your decision, and I appreciate your consideration. If there’s any way to revisit this request in the future, please let me know."' }],
                    },
                ],
            },
        ],
    },
    {
        id: '3',
        title: 'Weekly report summary',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // 1 week ago
        messages: [
            {
                sender: Sender.USER,
                text: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Can you summarize this week’s report?' }],
                    },
                ],
            },
            {
                sender: Sender.BOT,
                text: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Here is the summary of this week’s report:\n' +
                                    '1. Project A: Completed the initial phase and delivered the first draft to the client.\n' +
                                    '2. Team B: Resolved 95% of the reported bugs and improved system performance by 20%.\n' +
                                    '3. Upcoming Tasks: Finalize the budget for Project C and prepare for the client presentation next week.',
                            },
                        ],
                    },
                ],
            },
        ],
    }
]
