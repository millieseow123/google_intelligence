import React from 'react';
import { Button, Typography } from '@mui/material';
import styles from './index.module.css';

interface IconTextButtonProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export default function IconTextButton({ name, icon, onClick }: IconTextButtonProps) {
    return (
        <div className={styles.buttonContainer}>
            <Button
                className={styles.button}
                startIcon={icon}
                onClick={onClick}
            >
                <Typography variant="subtitle2" className={styles.buttonText}>
                    {name}
                </Typography>
            </Button>
        </div>
    );
}