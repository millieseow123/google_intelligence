import { useEffect, useState } from 'react'

export interface Contact {
    name: string
    email: string
    photo?: string
}

export function useContacts(accessToken?: string) {
    const [contacts, setContacts] = useState<Contact[]>([])

    useEffect(() => {
        if (!accessToken) return

        const fetchContacts = async () => {
            const res = await fetch(
                'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos',
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            )
            const data = await res.json()
            const parsed = data.connections
                ?.flatMap((person: any) =>
                    person.emailAddresses?.map((email: any) => ({
                        name: person.names?.[0]?.displayName || '',
                        email: email.value,
                        photo: person.photos?.[0]?.url,
                    }))
                )
                .filter(Boolean)

            setContacts(parsed || [])
        }

        fetchContacts()
    }, [accessToken])

    return contacts
}
