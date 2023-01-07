import { Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

import React, { useState } from 'react';

export default function ModTableComponent(props) {
    // Extract the array of rows passed to the component as a prop.
    const { rows } = props;

    // React state variables for the table pagination.
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);

    // Handler for the next page button in the table pagination.
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    // Handler for when the rows per page is changed for the table pagination.
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    // Returns a table, iterating through each element extracted from the components props rows array and creating a table row using it's data.
    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="left" width="50%">Mod Name</TableCell>
                    <TableCell align="right" width="25%">Requested By</TableCell>
                    <TableCell align="right" width="25%">Date Approved</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                        return <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="left" component="th" scope="row"><Link href={row.link} target="_blank" rel="noreferrer">{row.name}</Link></TableCell>
                            <TableCell align="right">{row.requester}</TableCell>
                            <TableCell align="right">{new Date(row.approvedDate).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                            })}</TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
            <TableFooter>
                <TablePagination rowsPerPageOptions={[ 5, 10, 15, 20 ]} colSpan={3} count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableFooter>
        </Table>
    </TableContainer>
}