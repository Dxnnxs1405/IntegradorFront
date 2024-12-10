import { useState, useEffect } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL, useUser } from '../context/UserContext';
import ConfirmationDialog from './ConfirmationDialog';
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";

const TiposCanchasAdmin = () => {
    const { token } = useUser();
    const [fieldTypes, setFieldTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFieldType, setCurrentFieldType] = useState({ name: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchFieldTypes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldType`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setFieldTypes(data);
        } catch (error) {
            console.error('Error al obtener los tipos de canchas:', error);
        }
    };

    useEffect(() => {
        fetchFieldTypes();
    }, []);

    const handleOpenDialog = (fieldType = { name: '' }) => {
        setCurrentFieldType(fieldType);
        setIsEditing(!!fieldType.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentFieldType({ name: '' });
        setIsEditing(false);
    };

    const handleSaveFieldType = async () => {
        const url = `${API_BASE_URL}/fieldType`;
        const method = isEditing ? 'PUT' : 'POST';

        const body = isEditing
            ? { id: currentFieldType.id, fieldType: currentFieldType.name }
            : { fieldType: currentFieldType.name };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Error al guardar el tipo de cancha');
            await fetchFieldTypes();
            handleCloseDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleOpenDeleteDialog = (fieldType) => {
        setCurrentFieldType(fieldType);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCurrentFieldType({ name: '' });
    };

    const handleDeleteFieldType = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldType/${currentFieldType.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error al eliminar el tipo de cancha');
            await fetchFieldTypes();
            handleCloseDeleteDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const filteredFieldTypes = fieldTypes.filter(fieldType =>
        fieldType.name && fieldType.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Tipos de Canchas
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                    label="Buscar Tipo de Cancha"
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
                    {filteredFieldTypes.map((fieldType) => (
                        <ListItem key={fieldType.id} secondaryAction={
                            <Box>
                                <IconButton edge="end" color="primary" onClick={() => handleOpenDialog(fieldType)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleOpenDeleteDialog(fieldType)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        }>
                            <ListItemText primary={fieldType.name || 'Nombre no disponible'} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Editar Tipo de Cancha' : 'Agregar Nuevo Tipo de Cancha'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre del Tipo de Cancha"
                        fullWidth
                        variant="outlined"
                        value={currentFieldType.name}
                        onChange={(e) => setCurrentFieldType({ ...currentFieldType, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveFieldType} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteFieldType}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el tipo de cancha "${currentFieldType ? currentFieldType.name : ''}"?`}
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

export default TiposCanchasAdmin;