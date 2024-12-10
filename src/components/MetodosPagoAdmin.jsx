import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL, useUser } from '../context/UserContext';
import ConfirmationDialog from './ConfirmationDialog';
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";

const MetodosPagoAdmin = () => {
    const { token } = useUser();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState({ method: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/paymentMethods`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setPaymentMethods(data);
        } catch (error) {
            console.error('Error al obtener los métodos de pago:', error);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const handleSavePaymentMethod = async () => {
        const url = `${API_BASE_URL}/paymentMethods`;
        const method = isEditing ? 'PUT' : 'POST';

        const body = isEditing
            ? { id: currentPaymentMethod.id, method: currentPaymentMethod.method }
            : { method: currentPaymentMethod.method };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Error al guardar el método de pago');
            await fetchPaymentMethods();
            handleCloseDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleOpenDialog = (paymentMethod = { method: '' }) => {
        setCurrentPaymentMethod(paymentMethod);
        setIsEditing(!!paymentMethod.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentPaymentMethod({ method: '' });
        setIsEditing(false);
    };

    const handleOpenDeleteDialog = (paymentMethod) => {
        setCurrentPaymentMethod(paymentMethod);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCurrentPaymentMethod({ method: '' });
    };

    const handleDeletePaymentMethod = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/paymentMethods/${currentPaymentMethod.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) setError(error.message);
            await fetchPaymentMethods();
            handleCloseDeleteDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const filteredPaymentMethods = paymentMethods.filter(paymentMethod =>
        paymentMethod.method && paymentMethod.method.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Métodos de Pago
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                    label="Buscar Método de Pago"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, maxWidth: '300px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Agregar
                </Button>
            </Box>

            <Paper elevation={3} sx={{ padding: 2 }}>
                <List>
                    {filteredPaymentMethods.map((paymentMethod) => (
                        <ListItem key={paymentMethod.id} secondaryAction={
                            <>
                                <IconButton edge="end" color="primary" onClick={() => handleOpenDialog(paymentMethod)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleOpenDeleteDialog(paymentMethod)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }>
                            <ListItemText primary={paymentMethod.method || 'Método no disponible'} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Editar Método de Pago' : 'Agregar Nuevo Método de Pago'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre del Método de Pago"
                        fullWidth
                        variant="outlined"
                        value={currentPaymentMethod.method}
                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, method: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSavePaymentMethod} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeletePaymentMethod}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el método de pago "${currentPaymentMethod ? currentPaymentMethod.method : ''}"?`}
            />

            <SuccessDialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
                title="¡Éxito!"
                message="Los cambios se han guardado exitosamente."
            />
            <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                title="Error"
                message={error}
            />
        </Box>
    );
};

export default MetodosPagoAdmin;