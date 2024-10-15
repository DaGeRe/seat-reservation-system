import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function EmployeeTable({ employees, onAction, action, t }) {
  return (
    <TableContainer  component={Paper}>
      <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
        <TableHead sx={{backgroundColor: 'green', color:'white'}}>
          <TableRow>
            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}> ID</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t("email")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("name")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("surname")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("admin")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("visibility")}</TableCell>
            <TableCell sx={{textAlign: 'center',fontSize:15,color:'white' }} colSpan={2}>{t("action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((row) => (
            <TableRow  key={row.id}>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.email}
              </TableCell>

              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.name}
              </TableCell>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.surname}
              </TableCell>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.admin?t("true"):t("false")}
              </TableCell>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.visibility?t("true"):t("false")}
              </TableCell>
              
              
              
              <TableCell sx={{textAlign: 'center', fontSize:14, width:'30%'   }} component="th" scope="row">
              <Button onClick={() => onAction(row.id)}>{action}</Button>
             </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmployeeTable;