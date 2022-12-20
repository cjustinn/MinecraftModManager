import { Alert, Autocomplete, Button, Card, CardContent, CircularProgress, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useState } from 'react';

export default function RequestModPage() {
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: 'success',
        message: 'You have successfully requested the mod!'
    });

    const [ modName, setModName ] = useState("");
    const [ modLink, setModLink ] = useState("");
    const [ requesterName, setRequesterName ] = useState("");

    const [ processing, setProcessing ] = useState(false);

    const autocompleteOptions = [
        'August',
        'Ben',
        'Dawn',
        'Ian',
        'Justin',
        'Mason',
        'Soy',
        'Tommy'
    ]

    const displaySnackbar = (success, message) => {
        setSnackbarData({
            severity: success ? "success" : "error",
            message: message
        });

        setShowSnackbar(true);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        setProcessing(true);
        
        fetch(`${process.env.REACT_APP_API_URL}/mod-requests/add`, {
            method: "POST",
            body: JSON.stringify({
                modData: {
                    requester: requesterName,
                    modName: modName,
                    link: modLink,
                    requestedDate: Date.now()
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(resp => {
            displaySnackbar(resp.success, resp.message);

            if (resp.success) {
                setModName("");
                setModLink("");
                setRequesterName("");
            }

            setProcessing(false);
        }).catch(err => {
            setProcessing(false);

            displaySnackbar(false, "There was a problem submitting your mod request. Please try again.");
        })
    }

    return <Box justifyContent="center" alignItems="center" display="flex" minWidth="100%">
        <Stack spacing={1} maxWidth="66%">
            <Card>
                <CardContent>
                    <Typography variant="h3" mb={2}>Mod Request Form</Typography>
                    <Typography mb={5} mx="auto" maxWidth="75%" variant="body1" color="grey.500">
                        When you're entering the mod name, please make it match the name on the mod's CurseForge listing as closely as possible. When you're putting the mod link in, please make sure that you paste the <b>full link</b>, and that the mod comes from CurseForge. <b>Please do not use anybody elses name when you're requesting a mod.</b>
                    </Typography>

                    <form onSubmit={handleFormSubmit}>
                        <Stack spacing={2}>
                            <TextField label="Mod Name" variant="outlined" sx={{ minWidth: "100%" }} required value={modName} onChange={(e) => setModName(e.target.value)}/>
                            <TextField label="CurseForge Link" variant="outlined" sx={{ minWidth: "100%" }} required value={modLink} onChange={(e) => setModLink(e.target.value)}/>
                            <Autocomplete disablePortal options={autocompleteOptions} value={requesterName} inputValue={requesterName} onInputChange={(event, newInputValue) => setRequesterName(newInputValue)} renderInput={(params) => <TextField label="Who Are You?" {...params} required/>}/>
                            <Button type="submit" variant="contained" disabled={processing}>{processing ? <Stack direction="row" spacing={1}><CircularProgress size={25}/><span>Please Wait...</span></Stack> : "Submit Mod Request"}</Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Stack>

        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={2500}
        onClose={() => setShowSnackbar(false)}>
            <Alert severity={snackbarData.severity}>{snackbarData.message}</Alert>
        </Snackbar>
    </Box>
}