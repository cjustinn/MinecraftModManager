import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';

export default function NotFoundPage() {
    return <Box justifyContent="center" alignItems="center" display="flex" minWidth="100%">
        <Stack spacing={1}>
            <Typography variant="h2" fontWeight="bold">404 - LOST PAGE</Typography>
            <Typography variant="body1" fontSize={17.5} color="grey.500">How did you get here? This place doesn't exist!</Typography>
        </Stack>
    </Box>
}