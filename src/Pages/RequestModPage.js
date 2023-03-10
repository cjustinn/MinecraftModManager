import { Alert, Autocomplete, Button, Card, CardContent, CircularProgress, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';

import { displaySnackbar } from '../Services/HelperService';

export default function RequestModPage() {
    // Snackbar display flag state variable, and it's data state variable.
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: 'success',
        message: 'You have successfully requested the mod!'
    });

    // React state variables used to hold the user's input and populate the mod request fetch POST call when the form is submitted.
    const [ modName, setModName ] = useState("");
    const [ modLink, setModLink ] = useState("");
    const [ requesterName, setRequesterName ] = useState("");

    // Processing flag variable used to stop multiple submits from happening before the previous can be fully handled.
    const [ processing, setProcessing ] = useState(false);

    // Array holding the string values used to populate the "requester name" dropdown / autocomplete field options.
    const autocompleteOptions = [
        'John Doe',
        'Jane Doe',
        'Justin'
    ]

    // Handler for when the request form is submitted.
    const handleFormSubmit = (e) => {
        e.preventDefault();

        setProcessing(true);
        
        // Send a POST request to the API endpoint responsible for saving new mod requests to the MongoDB collection, with the body being a new object containing all of the user-input values formatted to match the expected schema format.
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
            // Display a message to the user, using the success and message values from the response.
            displaySnackbar(setSnackbarData, setShowSnackbar, {severity: resp.success ? 'success' : 'error', message: resp.message });

            if (resp.success) {
                // If the mod request was successfully saved, reset the user input fields to be empty.
                setModName("");
                setModLink("");
                setRequesterName("");
            }

            setProcessing(false);
        }).catch(err => {
            setProcessing(false);

            displaySnackbar(setSnackbarData, setShowSnackbar, { severity: "error", message: "There was a problem submitting your mod request. Please try again." });
        })
    }

    return <Grid container spacing={2} my={2} px={2}>
        <Grid item sm={12} md={3} px={2}>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={4}>
                            <Stack spacing={0}>
                                <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Instructions</Typography>
                                <Typography variant="body1" textAlign="start" color="grey.500">
                                    When you are requesting a mod, to make life easier for me when it comes to making sure that it's compatible with all the other mods, please try to do the following as much as humanly possible:
                                </Typography>
                            </Stack>

                            <Typography variant="body1" textAlign="start">
                                <ul style={{ listStyleType: "square" }}>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        When entering the mod name, please make it match the name on the CurseForge listing as closely as possible, if the mod has a CurseForge page.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        <Typography color="grey.300">When providing the mod link, if the mod has a CurseForge listing then the link provided should be that of it's CurseForge page. Exceptions can be made for some mods which aren't available on CurseForge and instead have to be downloaded from GitHub or their own website (i.e: Optifine).</Typography>
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        When selecting your name from the dropdown, <b>please do not use anybody elses name.</b> I need to know who has requested what so that I know who to talk to if there is a problem (compatibility, version, etc.).
                                    </li>
                                    <li>
                                        <Typography color="grey.300">Do not provide mod links from anywhere other than GitHub, CurseForge, or a custom website if the mod is a large, well-known safe mod.</Typography>
                                    </li>
                                </ul>
                            </Typography>

                            <Typography variant="body1" textAlign="start" color="grey.500">
                                If you have any questions, feel free to ask and I will do my best to clarify. The instructions above are there just to make my life easier, and the last one is there to additionally help me avoid bricking my PC with a virus from some sketchy website.
                            </Typography>
                            
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Grid>
        <Grid item sm={12} md={9} px={2}>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={4}>
                            <Stack spacing={0}>
                                <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Mod Request Form</Typography>
                                <Typography variant="body1" textAlign="start" color="grey.500">
                                    Enter the details of the mod that you would like to request below. Please make sure to read the instructions first to make my life easier.
                                </Typography>
                            </Stack>

                            <form onSubmit={handleFormSubmit}>
                                <Stack spacing={2}>
                                    <TextField label="Mod Name" variant="outlined" sx={{ minWidth: "100%" }} value={modName} onChange={e => setModName(e.target.value)} required/>
                                    <TextField label="Mod Link" variant="outlined" sx={{ minWidth: "100%" }} value={modLink} onChange={e => setModLink(e.target.value)} required/>
                                    <Autocomplete disablePortal options={autocompleteOptions} value={requesterName} inputValue={requesterName} onInputChange={(event, newInputValue) => setRequesterName(newInputValue)} renderInput={(params) => <TextField label="Who Are You?" {...params} required/>}/>

                                    <Button type="submit" variant="contained" disabled={processing}>{processing ? <Stack direction="row" spacing={1}><CircularProgress size={25}/><span>Please Wait...</span></Stack> : "Submit Mod Request"}</Button>
                                </Stack>
                            </form>
                        </Stack>
                    </CardContent>
                </Card>

                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={showSnackbar}
                autoHideDuration={2500}
                onClose={() => setShowSnackbar(false)}>
                    <Alert severity={snackbarData.severity}>{snackbarData.message}</Alert>
                </Snackbar>
            </Stack>
        </Grid>
    </Grid>
}