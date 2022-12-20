import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import ModTableComponent from '../Components/ModTableComponent';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function HomePage() {
    const [ loading, setLoading] = useState(true);
    const [ success, setSuccess ] = useState(true);

    const [ mods, setMods ] = useState([]);

    const getModData = () => {
        setLoading(true);
        setSuccess(false);

        fetch(`${process.env.REACT_APP_API_URL}/mods/all`).then(r => r.json()).then(resp => {
            setSuccess(resp.success);
            setMods(resp._data);

            setLoading(false);
        }).catch(() => {
            setSuccess(false);
            setLoading(false);
        });
    }
    useEffect(() => {
        getModData();
    }, []);

    return <Grid container spacing={2} my={2} px={2}>
        <Grid item xs={12} md={4} px={2}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">What is this website?</Typography>
                        <Stack spacing={2}>
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
                                <b>Please do not use anyone elses name when you're requesting a mod,</b> I want to be able to properly keep track of who wants what so I know who to talk to if there is a problem. You'll be able to revisit this website whenever you want to see a fully updated list of mods which I've confirmed as part of the modpack, but I will also do my best to either let the people who've requested a mod know directly (or in big corm) on Discord.
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={8} px={2}>
            <Card>
                <CardContent>
                    <Stack spacing={1}>
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
                                    <Typography variant="body1" color="grey.500" textAlign="start">There are currently no confirmed mods in the modpack.</Typography>
                                )
                                :
                                <Typography variant="body1" color="red" textAlign="start">There was a problem loading the mod list. Please try refreshing the page!</Typography>
                            )
                        }
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
}