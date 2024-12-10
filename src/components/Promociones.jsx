import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL, useUser } from '../context/UserContext';
import ConfirmationDialog from './ConfirmationDialog';
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";

const Promociones = () => {
    const { token } = useUser();
    const [promotions, setPromotions] = useState([]);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState({
        discount: '',
        description: '',
        start: '',
        end: ''
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [errors, setErrors] = useState({});
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchPromotions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/promotion`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setPromotions(data);
        } catch (error) {
            console.error('Error al obtener las promociones:', error);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleSavePromotion = async () => {
        if (!validateForm()) return;

        const url = `${API_BASE_URL}/promotion`;
        const method = isEditing ? 'PUT' : 'POST';

        const body = isEditing
            ? { id: currentPromotion.id, ...currentPromotion }
            : currentPromotion;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Error al guardar la promoción');
            await fetchPromotions();
            handleCloseDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!currentPromotion.discount) {
            newErrors.discount = 'El descuento es obligatorio';
        } else if (currentPromotion.discount < 0 || currentPromotion.discount > 100) {
            newErrors.discount = 'El descuento debe ser entre 0 y 100';
        }

        if (!currentPromotion.description) {
            newErrors.description = 'La descripción es obligatoria';
        }

        if (!currentPromotion.start) {
            newErrors.start = 'La fecha de inicio es obligatoria';
        }

        if (!currentPromotion.end) {
            newErrors.end = 'La fecha de fin es obligatoria';
        }

        if (currentPromotion.start && currentPromotion.end && new Date(currentPromotion.start) > new Date(currentPromotion.end)) {
            newErrors.end = 'La fecha de fin no puede ser anterior a la fecha de inicio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenDialog = (promotion = { discount: '', description: '', start: '', end: '' }) => {
        setCurrentPromotion(promotion);
        setIsEditing(!!promotion.id);
        setOpenDialog(true);
        setErrors({});
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentPromotion({ discount: '', description: '', start: '', end: '' });
        setIsEditing(false);
        setErrors({});
    };

    const handleOpenDeleteDialog = (promotion) => {
        setCurrentPromotion(promotion);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCurrentPromotion({ discount: '', description: '', start: '', end: '' });
    };

    const handleDeletePromotion = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/promotion/${currentPromotion.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error al eliminar la promoción');
            await fetchPromotions();
            handleCloseDeleteDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const filteredPromotions = promotions.filter(promotion =>
        promotion.description && promotion.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Promociones
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                    label="Buscar Promoción"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, maxWidth: '300px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Agregar
                </Button>
            </Box>

            <Paper elevation={3} sx={{ padding: 2 }}>
                <List>
                    {filteredPromotions.map((promotion) => (
                        <ListItem key={promotion.id} secondaryAction={
                            <>
                                <IconButton edge="end" color="primary" onClick={() => handleOpenDialog(promotion)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleOpenDeleteDialog(promotion)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }>
                            <ListItemText
                                primary={`${promotion.discount}% - ${promotion.description}`}
                                secondary={`Desde: ${new Date(promotion.start).toLocaleDateString()} Hasta: ${new Date(promotion.end).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Editar Promoción' : 'Agregar Nueva Promoción'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Descuento (%)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentPromotion.discount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                                setCurrentPromotion({ ...currentPromotion, discount: value });
                            }
                        }}
                        required
                        error={!!errors.discount}
                        helperText={errors.discount}
                    />

                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        variant="outlined"
                        value={currentPromotion.description}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                        required
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Inicio"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={currentPromotion.start}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, start: e.target.value })}
                        required
                        error={!!errors.start}
                        helperText={errors.start}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Fin"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        value={currentPromotion.end}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, end: e.target.value })}
                        required
                        error={!!errors.end}
                        helperText={errors.end}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSavePromotion} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeletePromotion}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la promoción "${currentPromotion ? currentPromotion.description : ''}"?`}
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

export default Promociones;