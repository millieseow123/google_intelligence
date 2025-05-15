import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

const blink = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`;

export default function LoadingDots() {
    return (
        <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
            {[0, 0.2, 0.4].map((delay, i) => (
                <Box
                    key={i}
                    component="span"
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'grey.500',
                        animation: `${blink} 1.4s infinite`,
                        animationDelay: `${delay}s`,
                    }}
                />
            ))}
        </Box>
    );
}
