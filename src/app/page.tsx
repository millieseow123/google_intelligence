"use client"

import { getSession, signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from '@mui/material';
import googleLogo from '@/assets/images/google_logo.svg'
import LoadingSpinner from '@/components/loadingSpinner/loadingSpinner';
import { SessionStatus } from '@/types/sessionStatus';

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === SessionStatus.AUTHENTICATED) {
      router.replace('/chat')
    }
  }, [status, router])

  if (status === SessionStatus.LOADING) <LoadingSpinner />

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        router.push('/chat')
      }
    })
  }, [])

  return (
    <Box sx={{ textAlign: 'center', paddingTop: '4rem', gap: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Welcome to Google Intelligence</h1>
      <Button
        onClick={() => signIn('google')}
        variant="outlined"
        startIcon={
          <Image
            src={googleLogo}
            alt="Google logo"
            width={20}
            height={20}
          />
        }
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          padding: '6px 12px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#1e1e1e',
          bgcolor: 'white',
          borderColor: '#ddd',
          '&:hover': {
            backgroundColor: '#f7f7f7',
            borderColor: '#ccc',
          },
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '14px' }}>
          Sign in with Google
        </Typography>
      </Button>
    </Box>
  );
}
