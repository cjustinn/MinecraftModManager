import { Alert, Button, Card, CardContent, CircularProgress, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { LoginWithEmail } from "../Services/FirebaseService";

import { displaySnackbar } from "../Services/HelperService";

export default function AdminPanelLoginPage() {
    // React state variables used to hold the user's email and password input values.
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    
    // React state flag variable used to stop the login button from being pressed multiple times before it can finish attempting a login using the then-current email and password values.
    const [ processing, setProcessing ] = useState(false);

    // React state variables for displaying the snackbar and populating it with configurable data.
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: 'success',
        message: 'n/a'
    });

    // Handler for when the login form is submitted.
    const handleSubmit = e => {
        e.preventDefault();

        setProcessing(true);

        LoginWithEmail(email, password).then(r => {
            if (!r.success) {
                displaySnackbar(setSnackbarData, setShowSnackbar, { severity: 'error', message: r.error });
            }
        }).catch(err => {
            displaySnackbar(setSnackbarData, setShowSnackbar, { severity: 'error', message: err });
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