import { Alert, Button, Card, CardContent, Divider, Grid, Link, Snackbar, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';

export default function DownloadPage() {

    // React state variables for displaying the snackbar and populating it with configurable data.
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: "success",
        message: "n/a"
    });

    // Function which takes a color (_s) and a message (_m) and updates the snackbarData state object and display flag variable to show the snackbar with the provided data to the user.
    const openSnackbar = (_s, _m) => {
        setSnackbarData({
            severity: _s,
            message: _m
        });

        setShowSnackbar(true);
    }

    return (
        <Grid container py={3} px={2}>
            <Grid xs={12} md={5}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Stack spacing={0}>
                                <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Technic Launcher</Typography>
                                    <Typography variant="body1" textAlign="start" color="grey.500">
                                        You can install the modpack using the technic launcher, which will let you keep the modpack separate from your vanilla / modded version of the game which is run through the vanilla Minecraft launcher.
                                    </Typography>
                            </Stack>

                            <Typography variant="body1" textAlign="start">
                                You can follow the steps below to install the modpack using the technic launcher:
                            </Typography>

                            <Typography variant="body1" textAlign="start" color="grey.300">
                                <ol type="I">
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Download the technic launcher from <Link href="https://www.technicpack.net/download" target="_blank" rel="noreferrer">here</Link>, or by clicking the "Download Technic Launcher" button below.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Log into the account associated with your copy of Minecraft, and then open the "Modpacks" tab in the launcher.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        <Stack spacing={2}>
                                            <span>Copy the Technic API url below, either from the text box or by clicking the "Copy API Url" button below, and in the Modpacks tab on the Technic Launcher paste it into the search bar above the list of official modpacks and press enter.</span>
                                            <TextField type="text" disabled={true} label="Technic API URL" value="https://api.technicpack.net/modpack/the-corm-pack"/>
                                        </Stack>
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        With the modpack now selected, click the "Install" button in the bottom-right corner of the launcher and wait for the modpack to finish installing.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        <Stack spacing={0}>
                                            <Typography variant="body1">
                                                In the launcher, click the "Launcher Options" button in the top-right corner, select "Java Settings", and increase the memory dropdown to between 6 GB and 8 GB.
                                            </Typography>
                                            <Typography variant="body2" color="grey.500" fontSize="small">
                                                **If you are not able to change the value of the memory dropdown option, you have to install the 64-bit version of Java. <Link href="https://www.java.com/en/download/manual.jsp" target="_blank" rel="noreferrer">You can do so here</Link>.
                                            </Typography>
                                        </Stack>
                                    </li>
                                    <li>
                                        You are now ready to launch the game, add the server to your server list, and play. The server ip address and port are the same as the vanilla server, available in the discord.
                                    </li>
                                </ol>
                            </Typography>

                            <Button variant="contained" onClick={() => {
                                navigator.clipboard.writeText(`https://api.technicpack.net/modpack/the-corm-pack`);
                                openSnackbar('success', "The API URL has been copied to your clipboard!");
                            }}>Copy API URL</Button>

                            <Snackbar anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                            autoHideDuration={2500}
                            open={showSnackbar}
                            onClose={() => setShowSnackbar(false)}>
                                <Alert severity={snackbarData.severity}>{snackbarData.message}</Alert>
                            </Snackbar>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={0} md={2}>
                <Divider orientation="vertical">
                    <Typography variant="button" fontSize={32}>OR</Typography>
                </Divider>
            </Grid>

            <Grid item xs={12} md={5}>
            <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Stack spacing={0}>
                                <Typography variant="h4" textAlign="end" fontWeight="bold" textTransform="uppercase">Manually Install</Typography>
                                    <Typography variant="body1" textAlign="end" color="grey.500">
                                        If you don't want to use the technic launcher, you can install the mods manually and run the game through the official Mojang launcher. I will be providing a CurseForge option in the near future as well.
                                    </Typography>
                            </Stack>

                            <Typography variant="body1" textAlign="start">
                                You can follow the steps below to manually install the modpack to your game:
                            </Typography>

                            <Typography variant="body1" textAlign="start" color="grey.300">
                                <ol type="I">
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Download the modpack zip file from Dropbox <Link href="https://www.dropbox.com/s/26jq9g7qy14inbg/TheCormPack-Manual.zip?dl=1" target="_blank" rel="noreferrer">here</Link>, or by clicking the "Download Modpack Files" button below.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Run the <code>forge-1.19.2-43.2.0-installer.jar</code> file, and click the install button <b>without changing any settings</b>. This will install Forge onto your client, and create a forge game profile in your launcher.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Open a File Explorer window and navigate to <code style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>%appdata%\.minecraft</code> which is your Minecraft install directory.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        <Stack spacing={0}>
                                            <span>Drag the mods, shaderpacks, and resourcepacks folders from the downloaded modpack files directly into the <code>.minecraft</code> folder that you just opened.</span>
                                            <Typography variant="body1" fontSize="small" color="error">
                                                **If you already have mods installed, you will need to empty or rename your existing mods folder <b>BEFORE</b> you drag the downloaded folders into the game directory.
                                            </Typography>
                                        </Stack>
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Launch the official Minecraft launcher, and click into the "Installations" tab at the top of the launcher.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Hover over your "forge" installation, click the three dot button, and then go into the edit menu for the profile.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Click the "more options" button at the bottom, and scroll to the "JVM ARGUMENTS" text box. The first argument should be -Xmx_G; replace the number in the place of the underscore with <b>6, 7, or 8</b>. Once completed, your jvm argument should begin with <code>-Xmx6G, -Xmx7G, or -Xmx8G</code>.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        Save the changes to your forge profile and go back to the "Play" tab on the launcher.
                                    </li>
                                    <li style={{ marginBottom: "0.5rem" }}>
                                        You are now ready to launch the game, add the server to your server list, and play. The server ip address and port are the same as the vanilla server, available in the discord.
                                    </li>
                                </ol>
                            </Typography>

                            <Button variant="contained" onClick={() => {
                                openSnackbar('success', "Your download has started!");
                            }}><a style={{ textDecoration: "none", color: "black" }} href="https://www.dropbox.com/s/26jq9g7qy14inbg/TheCormPack-Manual.zip?dl=1" target="_blank" rel="noreferrer">Download Modpack Files</a></Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )

}