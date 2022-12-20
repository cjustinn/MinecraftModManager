import { Alert, Autocomplete, Button, Card, CardContent, Grid, IconButton, LinearProgress, Link, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function AdminPanelDashboardPage() {
    const [ loading, setLoading ] = useState(true);
    const [ success, setSuccess ] = useState(false);

    const [ processing, setProcessing ] = useState(false);

    const [ requests, setRequests ] = useState([]);

    const [ showSnackbar, setShowSnackbar ] = useState(false);
    const [ snackbarData, setSnackbarData ] = useState({
        severity: "success",
        message: "n/a"
    });

    const [ activeFilter, setActiveFilter ] = useState("active");

    const [ filterType, setFilterType ] = useState("active");
    const [ filterTypeLabel, setFilterTypeLabel ] = useState("Active");

    const [ requesterActiveType, setRequesterActiveType ] = useState("all");
    const [ requesterActiveTypeLabel, setRequesterActiveTypeLabel ] = useState("All");

    const [ requesterActiveName, setRequesterActiveName ] = useState("");
    const [ requesterNameFilter, setRequesterNameFilter ] = useState("");
    const [ requesterActiveFilter, setRequesterActiveFilter ] = useState("all");

    // Table controls
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    // Functions

    const displaySnackbar = (_s, _m) => {
        setSnackbarData({
            severity: _s,
            message: _m
        });

        setShowSnackbar(true);
    }

    const handleResponse = (approved, modId, idx) => {
        setProcessing(true);
        
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

                            displaySnackbar("success", `You have successfully approved the ${_request.modName} mod!`);

                            setProcessing(false);
                            reloadTableData(activeFilter);

                        } else {
                            displaySnackbar("error", `The mod request has been closed, however there was a problem adding the mod to the confirmed list. Please contact Justin to have it manually added.`);

                            setProcessing(false);
                        }
                    }).catch(err => {
                        displaySnackbar("error", `The mod request has been closed, however there was a problem adding the mod to the confirmed list. Please contact Justin to have it manually added.`);

                        setProcessing(false);
                    })
                } else {
                    displaySnackbar("success", `You have successfully denied ${requests.at(idx).modName}!`);
                    setProcessing(false);
                    reloadTableData(activeFilter);
                }
            } else {
                displaySnackbar("error", `There was a problem ${approved ? 'approving' : 'denying'} the mod. Please try again!`);
                
                setProcessing(false);
            }
        }).catch(err => {
            displaySnackbar("error", `There was a problem ${approved ? 'approving' : 'denying'} the mod. Please try again!`);
            
            setProcessing(false);
        })
    }

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

    const handleFilterChangeSubmit = e => {
        e.preventDefault();

        setActiveFilter(filterType);
        setRequesterActiveFilter(requesterActiveType);
        setRequesterNameFilter(requesterActiveName);
    }

    useEffect(() => {
        reloadTableData(activeFilter);
    }, [ activeFilter, requesterActiveFilter, requesterNameFilter ]);

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
                        <Typography variant="h4" textAlign="start" fontWeight="bold" textTransform="uppercase">
                            Mod Requests
                        </Typography>
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
                                                    <TableCell align="left">Mod Name</TableCell>
                                                    <TableCell align="right">Requester</TableCell>
                                                    <TableCell align="right">Date Requested</TableCell>
                                                    <TableCell align="right">Controls</TableCell>
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