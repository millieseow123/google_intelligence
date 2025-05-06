import React from 'react';
import { Button, Typography } from '@mui/material';
import styles from './index.module.css';

interface ActionButtonProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export default function ActionButton({ name, icon, onClick }: ActionButtonProps) {
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