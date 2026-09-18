'use client';

import { InfoIcon } from '@/icons';
import { Box, Button, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface LongTextDisplayProps {
    title: string;
    content: string | null | undefined;
    tooltip?: string;
    iconSize?: number;
}

const LongTextDisplay = ({
    title,
    content,
    tooltip,
    iconSize = 16,
}: LongTextDisplayProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const hasContent = !!(content && String(content).trim() !== '');

    if (!hasContent) {
        return <span>N/A</span>;
    }

    const displayTooltip = tooltip || `Click to view ${title.toLowerCase()}`;

    return (
        <>
            <Tooltip title={displayTooltip}>
                <IconButton
                    size="small"
                    onClick={() => setModalOpen(true)}
                    sx={{ color: '#1976d2', display: 'block' }}
                >
                    <InfoIcon style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                </IconButton>
            </Tooltip>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        overflow: 'auto',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            mb: 3,
                            maxHeight: '50vh',
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            p: 1,
                        }}
                    >
                        {content || `No ${title.toLowerCase()} available`}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={() => setModalOpen(false)}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default LongTextDisplay;

