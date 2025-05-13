import React, { JSX } from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface ToolbarButtonProps {
    tooltip?: string;
    icon: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean
    buttonRef?: React.Ref<HTMLButtonElement>;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ tooltip, icon, onClick, isActive, disabled, buttonRef }) => (
    <Tooltip title={tooltip || ''}>
        <span>
            <IconButton
                onMouseDown={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                size="small"
                ref={buttonRef}
                sx={{
                    backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                    borderRadius: 2,
                    padding: '6px',
                    '&:hover': {
                        bgcolor: '#f0f0f0',
                    },
                }}
                disabled={disabled}
            >
                {icon}
            </IconButton>
        </span>
    </Tooltip>
);

export default ToolbarButton;