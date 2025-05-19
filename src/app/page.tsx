"use client";

import { getSession, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import googleLogo from "@/assets/images/google_logo.svg";
import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";
import { SessionStatus } from "@/types/sessionStatus";
import { CONSTANTS } from "@/constants/text";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === SessionStatus.AUTHENTICATED) {
      router.replace("/chat");
    }
  }, [status, router]);

  if (status === SessionStatus.LOADING) <LoadingSpinner />;

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/chat");
      }
    });
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        paddingTop: "4rem",
        gap: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{CONSTANTS.TITLE}</h1>
      <Button
        onClick={() => signIn("google")}
        variant="outlined"
        startIcon={
          <Image src={googleLogo} alt="Google logo" width={20} height={20} />
        }
        sx={{
          borderRadius: "16px",
          textTransform: "none",
          fontSize: "14px",
          fontWeight: 500,
          color: "#1e1e1e",
          bgcolor: "white",
          borderColor: "#ddd",
          "&:hover": {
            backgroundColor: "#f7f7f7",
            borderColor: "#ccc",
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontSize: "14px" }}>
          {CONSTANTS.BUTTONS.SIGNIN}
        </Typography>
      </Button>
    </Box>
  );
}
