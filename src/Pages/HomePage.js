import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import ModTableComponent from '../Components/ModTableComponent';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function HomePage() {
    // React states for keeping track of when things are loading, and if the loading was successful.
    const [ loading, setLoading] = useState(true);
    const [ success, setSuccess ] = useState(true);

    // React state for holding an array of objects to display on the page.
    const [ mods, setMods ] = useState([]);

    // React states for managing specific result filters.
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ resultsFiltered, setResultsFiltered ] = useState(false);

    /*
    
        Using fetch, connect to the API for the mod manager and request either:

        (A) All mods, if 'searchMode' param. is false

        or

        (B) All mods which contain the search query string (stored in 'searchQuery' state) if 'searchMode' param. is true
    
    */
    const getModData = (searchMode) => {
        setLoading(true);
        setSuccess(false);

        setResultsFiltered(searchMode);

        fetch(`${process.env.REACT_APP_API_URL}${searchMode ? `/mods/search?target=${searchQuery}` : `/mods/all`}`).then(r => r.json()).then(resp => {
            setSuccess(resp.success);
            setMods(resp._data);

            setLoading(false);
        }).catch(() => {
            setSuccess(false);
            setLoading(false);
        });
    }

    // Immediately when the page loads, get all mods.
    useEffect(() => {
        getModData(false);
    }, []);

    // When the filter search button is pressed, get all mods again but passing 'true' as the 'searchMode' param.
    const handleSearch = e => {
        e.preventDefault();

        getModData(true);
    }

    return <Grid container spacing={2} my={2} px={2}>
        <Grid item xs={12} md={3} px={2}>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">What is this website?</Typography>
                            <Stack spacing={2}>
                                { /*    Eventually, I'd like to move this to be customizable rather than hard-coded into the page.   */ }
                                <Typography variant="body1" textAlign="start">
                                    We're going to use this website to keep track of the mods which are added into our modpack, as well as making it easier for me to track which mods have been requested by y'all.
                                </Typography>
                                <Typography variant="body1" textAlign="start" color="grey.400">
                                    This page includes a list of all mods which have been requested that I've taken a look at and confirmed as part of the modpack; those decisions will be based on compatibility with already-added mods and the game version that the mod is currently updated for.
                                </Typography>
                                <Typography variant="body1" textAlign="start">
                                    If you have a mod that you want to request, you can use the little plus icon in the bottom-left corner of the screen to pull open the navigation options and go to the "Request Mod" page and fill out the form there.
                                </Typography>
                                <Typography variant="body1" textAlign="start" color="grey.400">
                                    <b>Please do not use anyone elses name when you're requesting a mod,</b> I want to be able to properly keep track of who wants what so I know who to talk to if there is a problem. You'll be able to revisit this website whenever you want to see a fully updated list of mods which I've confirmed as part of the modpack, but I will also do my best to either let the people who've requested a mod know directly on Discord.
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack spacing={0}>
                                <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Search</Typography>
                                <Typography variant="body1" textAlign="start" color="grey.400">
                                    Search for specific mods, by name, in the list of confirmed mods.
                                </Typography>
                            </Stack>

                            <form onSubmit={handleSearch}>
                                <Grid container spacing={2}>
                                    <Grid item sm={9}>
                                        <TextField required value={searchQuery} onChange={e => setSearchQuery(e.target.value)} label="Mod Name" sx={{ minWidth: "100%" }}/>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Button type="submit" variant="contained" disabled={loading} sx={{ minHeight: "100%", minWidth: "100%" }}>Search</Button>
                                    </Grid>
                                </Grid>
                            </form>

                            <Button variant="contained" onClick={() => {
                                setSearchQuery("");

                                getModData(false);
                            }}>Clear Search</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Grid>
        <Grid item xs={12} md={9} px={2}>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={1}>
                            <Stack spacing={0}>
                                <Grid container xs={12} spacing={2}>
                                    <Grid item xs={6} justifyContent="start">
                                        <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Confirmed Mod List</Typography>
                                    </Grid>
                                    <Grid item xs={6} alignItems="end" textAlign="end">
                                        <IconButton size="large" onClick={() => getModData()}>
                                            <RefreshIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" textAlign="start" color="grey.400">
                                    The following mods are part of the modpack.
                                </Typography>
                            </Stack>
                            {
                                loading ?
                                <Stack spacing={1}>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                    <Skeleton variant="rounded" animation="wave"/>
                                </Stack>
                                :
                                (
                                    success ?
                                    (
                                        mods.length > 0 ?
                                        <ModTableComponent rows={mods}/>
                                        :
                                        (
                                            resultsFiltered ?
                                            <Typography variant="body1" color="grey.500" textAlign="start">There are currently no confirmed mods which match your search parameters.</Typography>
                                            :
                                            <Typography variant="body1" color="grey.500" textAlign="start">There are currently no confirmed mods in the modpack.</Typography>
                                        )
                                    )
                                    :
                                    <Typography variant="body1" color="red" textAlign="start">There was a problem loading the mod list. Please try refreshing the page!</Typography>
                                )
                            }
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Grid>
    </Grid>
}