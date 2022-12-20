import { Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';

import React, { useEffect, useState } from 'react';

export default function ModTableComponent(props) {
    const { rows } = props;
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="left">Mod Name</TableCell>
                    <TableCell align="right">Requested By</TableCell>
                    <TableCell align="right">Date Approved</TableCell>
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
                <TablePagination rowsPerPageOptions={[ 5, 10, 20 ]} colSpan={3} count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
            </TableFooter>
        </Table>
    </TableContainer>
}