"use client"

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ChatLayout from '../../components/chatLayout/chatLayout'
import LoadingSpinner from '@/components/loadingSpinner/loadingSpinner'
import { SessionStatus } from '@/types/sessionStatus';
import ProfileMenu from '@/components/profileMenu/profileMenu';

export default function Chat() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSigningOut, setIsSigningOut] = useState(false)


    useEffect(() => {
        if (isSigningOut && status === SessionStatus.UNAUTHENTICATED) {
            router.push('/')
        }
    }, [status, isSigningOut, router])


    if (status === SessionStatus.LOADING || isSigningOut) return <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}
    >
        <LoadingSpinner />
    </div>

//ToDO: wrap below code with auth so /chat can be accessed only when authenticated
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                background: '#1e1e1e',
                padding: '0.5rem',
                alignItems: 'center',
                borderBottom: '1px solid #2a2a2a'
            }}>
                {session?.user?.image && (
                    <ProfileMenu imageUrl={session.user.image || ""}
                        onSignOutStart={() => {
                            setIsSigningOut(true)
                            signOut()
                        }} />
                )}
            </div>

            <ChatLayout />
        </div>
    )
}
