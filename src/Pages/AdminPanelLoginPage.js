import { Alert, Button, Card, CardContent, CircularProgress, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { LoginWithEmail } from "../Services/FirebaseService";

export default function AdminPanelLoginPage() {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ processing, setProcessing ] = useState(false);

    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: 'success',
        message: 'n/a'
    });

    const displaySnackbar = (severity, message) => {
        setSnackbarData({
            severity: severity,
            message: message
        });

        setShowSnackbar(true);
    }

    const handleSubmit = e => {
        e.preventDefault();

        setProcessing(true);

        LoginWithEmail(email, password).then(r => {
            if (!r.success) {
                displaySnackbar('error', r.error);
            }
        }).catch(err => {
            displaySnackbar('error', err);
        });

        setProcessing(false);
    }

    return <Box display="flex" alignItems="center" justifyContent="center" minWidth="100%">
        <Card sx={{ minWidth: "33%" }}>
            <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h4" textTransform="uppercase" fontWeight="bold">Admin Panel Login</Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField label="Email Address" type="email" variant="outlined" sx={{ minWidth: "100%" }} required value={email} onChange={e => setEmail(e.target.value)}/>
                            <TextField label="Password" type="password" variant="outlined" sx={{ minWidth: "100%" }} required value={password} onChange={e => setPassword(e.target.value)}/>
                            <Button type="submit" variant="contained" disabled={processing}>
                                {
                                    processing ?
                                    <Stack direction="row" spacing={1}>
                                        <CircularProgress size={25}/>
                                        <span>Please wait...</span>
                                    </Stack>
                                    :
                                    <span>Login</span>
                                }
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </CardContent>
        </Card>

        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}>
            <Alert severity={snackbarData.severity}>{snackbarData.message}</Alert>
        </Snackbar>
    </Box>
}