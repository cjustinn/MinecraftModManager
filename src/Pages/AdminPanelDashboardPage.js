import { Alert, Autocomplete, Button, Card, CardContent, Grid, IconButton, Link, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function AdminPanelDashboardPage() {
    // React state variables for page loading & loading success flags.
    const [ loading, setLoading ] = useState(true);
    const [ success, setSuccess ] = useState(false);

    // React state used to prevent buttons from being pressed more than once.
    const [ processing, setProcessing ] = useState(false);

    // React state array used to hold the array of mod requests currently loaded by filters (or the lack thereof).
    const [ requests, setRequests ] = useState([]);

    // React state for displaying the success / failure snackbar in the bottom center of the screen and managing it's coloring and text.
    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: "success",
        message: "n/a"
    });

    // React state for holding the active filter types used to build the api endpoint url.
    const [ activeFilter, setActiveFilter ] = useState("active");
    const [ requesterActiveName, setRequesterActiveName ] = useState("");
    const [ requesterActiveFilter, setRequesterActiveFilter ] = useState("all");

    // React states for holding the filter type (and it's label for the dropdown text display) before the filter is applied.
    const [ filterType, setFilterType ] = useState("active");
    const [ filterTypeLabel, setFilterTypeLabel ] = useState("Active");

    // React states for holding the sub-filter type and it's dropdown text display label before the filter is applied.
    const [ requesterActiveType, setRequesterActiveType ] = useState("all");
    const [ requesterActiveTypeLabel, setRequesterActiveTypeLabel ] = useState("All");

    // React state for holding the name filter before it is applied and the search is carried out.
    const [ requesterNameFilter, setRequesterNameFilter ] = useState("");

    // React state variables used for the table pagination.
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);

    // Handler for when the table pagination page is switched.
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    // Handler for when the table pagination "rows per page" selection is changed.
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    // Function which receives a color (_s) and a message (_m) and updates the snackbarData state variable, and sets the display flag state variable to display it on the page.
    const displaySnackbar = (_s, _m) => {
        setSnackbarData({
            severity: _s,
            message: _m
        });

        setShowSnackbar(true);
    }

    /*
        Handler for when a mod on the list is either confirmed or rejected using it's control buttons.
        Receives a boolean identifying if it was approved or rejected (approved), the mod id as a string,
        and the index of the mod in the array.
    */
    const handleResponse = (approved, modId, idx) => {
        // Enable the processing flag state variable to prevent any control buttons from being interacted with.
        setProcessing(true);
        
        // Send a request to the API endpoint responsible for updating mod requests, setting the request's approved status to the 'approved' value, and it's active status to false.
        fetch(`${process.env.REACT_APP_API_URL}/mod-requests/update`, {
            method: "PUT",
            body: JSON.stringify({
                target: `${modId}`,
                requestData: {
                    approved: approved,
                    active: false
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json()).then(resp => {
            if (resp.success) {
                if (approved) {
                    /*
                        If the mod request was updated successfully, and the mod was approved, make another fetch call to the API endpoint responsible for saving
                        new mods to the approved mods collection in the database, with a new object conforming to the collection schema expectations as the
                        request body.
                    */
                    let _request = requests.at(idx);
                    fetch(`${process.env.REACT_APP_API_URL}/mods/add`, {
                        method: "POST",
                        body: JSON.stringify({
                            modData: {
                                name: _request.modName,
                                requester: _request.requester,
                                link: _request.link,
                                associatedRequest: modId,
                                approvedDate: Date.now()
                            }
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(r2 => r2.json()).then(modResp => {
                        if (modResp.success) {

                            // Display a success message through the snackbar to the user.
                            displaySnackbar("success", `You have successfully approved the ${_request.modName} mod!`);

                            // Reset the processing flag variable to false and reload the table using the currently active filter.
                            setProcessing(false);
                            reloadTableData(activeFilter);

                        } else {
                            // Display an error message through the snackbar to the user.
                            displaySnackbar("error", `The mod request has been closed, however there was a problem adding the mod to the confirmed list. Please contact Justin to have it manually added.`);

                            // Reset the processing flag variable to false.
                            setProcessing(false);
                        }
                    }).catch(err => {
                        // If there was an error creating the approved mod element in the collection, display an error message to the user using the snackbar.
                        displaySnackbar("error", `The mod request has been closed, however there was a problem adding the mod to the confirmed list. Please contact Justin to have it manually added.`);

                        // Reset the processing flag variable to false.
                        setProcessing(false);
                    })
                } else {
                    // If the request was denied and the mod request was successfully updated, display a success message to the user using the snackbar.
                    displaySnackbar("success", `You have successfully denied ${requests.at(idx).modName}!`);

                    // Reset the processing flag variable to false, and reload the mod requests table using the active filter.
                    setProcessing(false);
                    reloadTableData(activeFilter);
                }
            } else {
                // If updating the mod request was unsuccessfully (but the fetch did not error out) display an error message to the user using the snackbar.
                displaySnackbar("error", `There was a problem ${approved ? 'approving' : 'denying'} the mod. Please try again!`);
                
                // Reset the processing flag variable to false.
                setProcessing(false);
            }
        }).catch(err => {
            // If updating the mod request led to the fetch erroring out, display an error message to the user using the snackbar.
            displaySnackbar("error", `There was a problem ${approved ? 'approving' : 'denying'} the mod. Please try again!`);
            
            // Reset the processing flag variable to false.
            setProcessing(false);
        })
    }

    // Function to use the passed filter to use the API to get all mod requests matching the passed filter constraints.
    const reloadTableData = (filter) => {
        setLoading(true);
        setSuccess(false);

        fetch(`${process.env.REACT_APP_API_URL}/mod-requests/${filter}${filter === "by-requester" ? `?target=${requesterNameFilter}` : ''}${filter === "by-requester" && requesterActiveFilter != "all" ? `&active=${requesterActiveFilter}` : ''}`).then(r => r.json()).then(resp => {
            setSuccess(resp.success);
            setRequests(resp._data);

            setLoading(false);
        }).catch(err => {
            setSuccess(false);
            setLoading(false);
        });

        
    }

    // Get the subtitle for the table, which displays what filters are currently active on the displayed results, based on the current value of the 'activeFilter' state variable.
    const getTableSubtitle = () => {
        let msg = undefined;

        switch(activeFilter) {
            case 'active':
                msg = `Displaying all active mod requests.`;
                break;
            case 'inactive':
                msg = `Displaying all inactive mod requests.`;
                break;
            case 'by-requester':
                msg = `Displaying ${requesterActiveFilter === 'all' ? 'all' : ( requesterActiveFilter === "true" ? "all active" : "all inactive" )} mod requests from ${requesterNameFilter}`;
                break;
            default:
                msg = `Displaying all mod requests.`;
                break;
        }

        return msg;
    }

    // Handler for when the filter form is submitted.
    const handleFilterChangeSubmit = e => {
        e.preventDefault();

        setActiveFilter(filterType);
        setRequesterActiveFilter(requesterActiveType);
        setRequesterNameFilter(requesterActiveName);
    }

    // When the value of the active filter, the sub-filter of the by-requester type, or when the name of the target user is updated, reset the table to the first page and reload the data using the active filter data.
    useEffect(() => {
        setPage(0);
        reloadTableData(activeFilter);
    }, [ activeFilter, requesterActiveFilter, requesterNameFilter ]);

    // Main filter autocomplete options, used for when the filter mode dropdown / autocomplete values are populated.
    const filterOptionAutocompleteList = [
        {
            label: "All",
            value: 'all'
        },
        {
            label: "Active",
            value: "active"
        },
        {
            label: "Inactive",
            value: "inactive"
        },
        {
            label: "By Requester",
            value: 'by-requester'
        }
    ]

    // Filter autocomplete options used for when the by-requester sub-filter dropdown / autocomplete values are populated.
    const filterRequesterActiveOptionsList = [
        {
            label: "All",
            value: "all"
        },
        {
            label: "Active",
            value: "true"
        },
        {
            label: "Inactive",
            value: "false"
        }
    ]

    // When the page first loads, call the reloadTableData function passing it the currently active filter (which should be 'all').
    useEffect(() => {
        reloadTableData(activeFilter);
    }, []);

    return <Grid container spacing={2} my={2} px={2}>
        <Grid item xs={12} md={3}>
            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">
                                Usage Instructions
                            </Typography>
                            <Typography variant="body1" textAlign="start">
                                Handling mod requests is incredibly simple; each row in the table is a separate request. If you click on the mod name it will open a new tab to the mod's curseforge page so that you can check for any dependencies, mod incompatibilities, and it's latest game version.
                            </Typography>
                            <Typography variant="body1" textAlign="start">
                                You can see who requested each mod, as well as when (down to the minute). At the end of each row are a set of controls that you can use: the check mark button will approve the mod and add it to the list of confirmed mods that is visible to everybody, and the x-mark will deny the mod and close the request without adding it to the list of confirmed mods.
                            </Typography>
                            <Typography variant="body1" textAlign="start">
                                Using the filters below, you can adjust what is shown in the table to show you all mod requests (active and inactive), only active requests, only inactive requests, or you can show only requests from a specific person (and then sub-filter those by active, inactive, or all).
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">
                                Table Filters
                            </Typography>
                            <form onSubmit={handleFilterChangeSubmit}>
                                <Stack spacing={1}>
                                    <Autocomplete value={filterTypeLabel} onChange={(e, newVal) => {
                                        setFilterType(newVal.value);
                                        setFilterTypeLabel(newVal.label);
                                    }} options={filterOptionAutocompleteList}
                                    renderInput={(params) => <TextField {...params} label="Filter Mode"/>}/>

                                    {
                                        filterType === "by-requester" ?
                                        <Stack direction="row" spacing={1}>
                                            <TextField required label="Requester Name" value={requesterActiveName} onChange={e => setRequesterActiveName(e.target.value)}/>
                                            <Autocomplete sx={{minWidth:"50%"}} value={requesterActiveTypeLabel} onChange={(e, newVal) => {
                                                setRequesterActiveType(newVal.value);
                                                setRequesterActiveTypeLabel(newVal.label);
                                            }} options={filterRequesterActiveOptionsList}
                                            renderInput={(params) => <TextField {...params} label="Sub-Filter Type"/>}/>
                                        </Stack>
                                        :
                                        null
                                    }

                                    <Button type="submit" variant="contained">Apply Filters</Button>
                                </Stack>
                            </form>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={6} justifyContent="start">
                                <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">Mod Requests</Typography>
                            </Grid>
                            <Grid item xs={6} alignItems="end" textAlign="end">
                                <IconButton size="large" onClick={() => reloadTableData(activeFilter)}>
                                    <RefreshIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Typography variant="body1" textAlign="start" color="grey.400">
                            {getTableSubtitle()}
                        </Typography>
                        {
                            loading ?
                            <Stack spacing={1}>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                                <Skeleton variant="rounded" animation="wave" color="grey.400"/>
                            </Stack>
                            :
                            (
                                success ?
                                (
                                    requests.length > 0 ?
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" width="50%">Mod Name</TableCell>
                                                    <TableCell align="right" width="20%">Requester</TableCell>
                                                    <TableCell align="right" width="20%">Date Requested</TableCell>
                                                    <TableCell align="right" width="10%">Controls</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                                                        return (
                                                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell align="left">
                                                                    <Link href={row.link}>{row.modName}</Link>
                                                                </TableCell>
                                                                <TableCell align="right">{row.requester}</TableCell>
                                                                <TableCell align="right">{new Date(row.requestedDate).toLocaleString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "2-digit",
                                                                    hour: "numeric",
                                                                    minute: "2-digit"
                                                                })}</TableCell>
                                                                <TableCell align="right">
                                                                    <IconButton disabled={processing || !row.active} color="success" onClick={() => handleResponse(true, row._id, idx)}>
                                                                        <CheckIcon/>
                                                                    </IconButton>
                                                                    <IconButton disabled={processing || !row.active} color="error" onClick={() => handleResponse(false, row._id, idx)}>
                                                                        <CloseIcon/>
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                            <TableFooter>
                                                <TablePagination rowsPerPageOptions={[ 5, 10, 20 ]} colSpan={4} count={requests.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <Typography variant="body1" color="grey.500" textAlign="start">There are currently no mod requests which match the provided filters.</Typography>
                                )
                                :
                                <Typography variant="body1" color="red" textAlign="start">There was an error getting active mod requests! Please try refreshing the page!</Typography>
                            )
                        }
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={showSnackbar}
            autoHideDuration={2500}
            onClose={() => setShowSnackbar(false)}>
                <Alert severity={snackbarData.severity}>{snackbarData.message}</Alert>
            </Snackbar>
        </Grid>
    </Grid>
}