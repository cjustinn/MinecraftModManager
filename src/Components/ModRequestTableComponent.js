import { IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function ModRequestTable(props) {
    // Extract the required props that were passed to the component.
    const { controlHandler, requests, processing } = props;

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

    return <TableContainer>
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
                        return <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0} }}>
                            <TableCell align="left">
                                <Link href={row.link}>{row.modName}</Link>
                            </TableCell>
                            <TableCell align="right">{row.requester}</TableCell>
                            <TableCell align="right">
                                {
                                    new Date(row.requestedDate).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                        hour: "numeric",
                                        minute: "2-digit"
                                    })
                                }
                            </TableCell>
                            <TableCell align="right">
                                <IconButton disabled={processing || !row.active} color="success" onClick={() => controlHandler(true, row._id, idx)}>
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton disabled={processing || !row.active} color="error" onClick={() => controlHandler(false, row._id, idx)}>
                                    <CloseIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
            <TableFooter>
                <TablePagination rowsPerPageOptions={[ 5, 10, 20 ]} colSpan={4} count={requests.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableFooter>
        </Table>
    </TableContainer>
}