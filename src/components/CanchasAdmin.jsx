import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Button,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ImgDefault from '../img/default.jpg';
import { API_BASE_URL, useUser } from '../context/UserContext';
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";
import ReservationForm from "./ReservationForm.jsx";

const CanchasAdmin = () => {
    const { user, token } = useUser();
    const [open, setOpen] = useState(false);
    const [canchas, setCanchas] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [selectedCancha, setSelectedCancha] = useState(null);
    const [newCancha, setNewCancha] = useState({ name: '', hourlyRate: '', fieldTypeId: '' });
    const [errors, setErrors] = useState({});
    const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!newCancha.name) newErrors.name = 'El nombre es obligatorio';
        if (!newCancha.hourlyRate) newErrors.hourlyRate = 'El precio por hora es obligatorio';
        if (!newCancha.fieldTypeId) newErrors.fieldTypeId = 'Debe seleccionar un tipo de cancha';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedCancha(null);
        setNewCancha({ name: '', hourlyRate: '', fieldTypeId: '' });
        setErrors({});
    };

    const fetchCanchas = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/field`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Error al obtener las canchas');
            const data = await response.json();
            setCanchas(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchFieldTypes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldType`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Error al obtener los tipos de cancha');
            const data = await response.json();
            setFieldTypes(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchCanchas();
        fetchFieldTypes();
        fetchUsuarios();
    }, []);

    const handleAddOrUpdateCancha = async () => {
        if (!validate()) return;

        try {
            const method = selectedCancha ? 'PUT' : 'POST';
            const url = selectedCancha
                ? `${API_BASE_URL}/field`
                : `${API_BASE_URL}/field`;

            const body = selectedCancha
                ? {
                    id: selectedCancha.id,
                    name: newCancha.name,
                    hourlyRate: newCancha.hourlyRate,
                    fieldTypeId: newCancha.fieldTypeId,
                    active: selectedCancha.active,
                }
                : {
                    name: newCancha.name,
                    hourlyRate: newCancha.hourlyRate,
                    fieldTypeId: newCancha.fieldTypeId,
                };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Error al guardar la cancha');
            await fetchCanchas();
            handleCloseDialog();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleOpenDialog = (cancha = null) => {
        setSelectedCancha(cancha);
        setNewCancha(
            cancha
                ? { name: cancha.name, hourlyRate: cancha.hourlyRate, fieldTypeId: cancha.fieldType.id }
                : { name: '', hourlyRate: '', fieldTypeId: '' }
        );
        setOpen(true);
    };

    const handleToggleActive = async (cancha) => {
        try {
            const updatedCancha = { ...cancha, active: !cancha.active };
            const response = await fetch(`${API_BASE_URL}/field/${cancha.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedCancha),
            });

            if (!response.ok) throw new Error('Error al cambiar el estado de la cancha');
            await fetchCanchas();
            setSuccessDialogOpen(true);
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleOpenReservationDialog = (cancha) => {
        setSelectedCancha(cancha);
        setReservationDialogOpen(true);
    };

    const handleCloseReservationDialog = () => {
        setReservationDialogOpen(false);
        setSelectedCancha(null);
    };

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Gestión de Canchas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ my: 2 }}
            >
                Agregar
            </Button>

            <Grid container spacing={2}>
                {canchas.map((cancha) => (
                    <Grid item xs={12} sm={6} md={4} key={cancha.id}>
                        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f9f9f9', textAlign: 'center' }}>
                            <img
                                src={ImgDefault}
                                alt="Cancha"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                }}
                            />
                            <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={1}>
                                <SportsSoccerIcon sx={{ color: '#4caf50', mr: 1 }} />
                                <Typography
                                    variant="h6"
                                    sx={{ color: cancha.active ? 'green' : 'red' }}
                                >
                                    {cancha.name}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Tipo: {cancha.fieldType.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Precio por hora: S/. {cancha.hourlyRate}
                            </Typography>
                            <Typography variant="body2" sx={{ color: cancha.active ? 'green' : 'red', fontWeight: 'bold' }}>
                                {cancha.active ? 'Activa' : 'Inactiva'}
                            </Typography>
                            <Box display="flex" justifyContent="center" mt={2}>
                                <IconButton
                                    color={cancha.active ? 'error' : 'success'}
                                    onClick={() => handleToggleActive(cancha)}
                                >
                                    {cancha.active ? (
                                        <ToggleOff sx={{ color: 'green' }} />
                                    ) : (
                                        <ToggleOn sx={{ color: 'red' }} />
                                    )}
                                </IconButton>
                                <IconButton color="primary" onClick={() => handleOpenDialog(cancha)}>
                                    <EditIcon />
                                </IconButton>
                                {cancha.active && (
                                    <IconButton color="primary" onClick={() => handleOpenReservationDialog(cancha)}>
                                        <EventIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{selectedCancha ? 'Editar Cancha' : 'Agregar Nueva Cancha'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre de la Cancha"
                        fullWidth
                        variant="outlined"
                        value={newCancha.name}
                        onChange={(e) => setNewCancha({ ...newCancha, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        margin="dense"
                        label="Precio por hora"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCancha.hourlyRate}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setNewCancha({ ...newCancha, hourlyRate: value });
                            }
                        }}
                        error={!!errors.hourlyRate}
                        required
                    />

                    <FormControl fullWidth margin="dense" error={!!errors.fieldTypeId}>
                        <InputLabel>Tipo de Cancha</InputLabel>
                        <Select
                            value={newCancha.fieldTypeId}
                            onChange={(e) => setNewCancha({ ...newCancha, fieldTypeId: e.target.value })}
                            label="Tipo de Cancha"
                        >
                            {fieldTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.fieldTypeId}</FormHelperText>
                    </FormControl>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddOrUpdateCancha} color="primary">
                            {selectedCancha ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <ReservationForm
                open={reservationDialogOpen}
                handleClose={handleCloseReservationDialog}
                cancha={selectedCancha}
                users={usuarios}
                user={user}
                token={token}
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

export default CanchasAdmin;