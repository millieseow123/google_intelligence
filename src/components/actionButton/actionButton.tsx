import React from 'react';
import { Button, Typography } from '@mui/material';
import styles from './index.module.css';

interface ActionButtonProps {
    name: string;
    icon: React.ReactNode;
}

export default function ActionButton({ name, icon }: ActionButtonProps) {
    return (
        <div className={styles.buttonContainer}>
            <Button
                startIcon={icon}
                className={styles.button}
            >
                <Typography variant="subtitle2" className={styles.buttonText}>
                    {name}
                </Typography>
            </Button>
        </div>
    );
}