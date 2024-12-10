import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Snackbar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL, useUser } from '../context/UserContext';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import GetAppIcon from '@mui/icons-material/GetApp';


import ConfirmationDialog from "./ConfirmationDialog";

const ReservasAdmin = () => {
    const { token } = useUser();
    const [reservas, setReservas] = useState([]);
    const [filter, setFilter] = useState('fecha');
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('error');

    const fetchReservas = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservation`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setReservas(data);
        } catch (error) {
            console.error('Error al obtener las reservas:', error);
            setErrorMessage(error.message);
            setSnackbarType('error');
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleDeleteReserva = async () => {
        if (selectedReserva) {
            try {
                const response = await fetch(`${API_BASE_URL}/reservation/${selectedReserva.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Error al eliminar la reserva');
                setReservas(reservas.filter(reserva => reserva.id !== selectedReserva.id));
                handleCloseDeleteDialog();
                setSuccessMessage('Reserva eliminada con éxito');
                setSnackbarType('success');
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error al eliminar la reserva:', error);
                setErrorMessage(error.message);
                setSnackbarType('error');
                setOpenSnackbar(true);
            }
        }
    };

    const handleOpenDeleteDialog = (reserva) => {
        setSelectedReserva(reserva);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedReserva(null);
    };

    const handleOpenModal = (reserva) => {
        setSelectedReserva(reserva);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedReserva(null);
    };

    const handleDownloadExcel = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservation/export/excel`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al descargar el archivo Excel');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reservas.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar Excel:', error);
            setErrorMessage(error.message);
            setSnackbarType('error');
            setOpenSnackbar(true);
        }
    };

    const filteredReservas = reservas.filter((reserva) => {
        const filterValue = filter === 'fecha' ? reserva.reservationDate :
            filter === 'cliente' ? `${reserva.client.firstName} ${reserva.client.lastName}` :
                filter === 'cancha' ? reserva.field.name : '';
        return filterValue && filterValue.toLowerCase().includes(search.toLowerCase());
    });

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Gestión de Reservas
            </Typography>
            <Typography>Consulta y administra las reservas realizadas por los clientes.</Typography>

            <Box display="flex" gap={2} alignItems="center" sx={{ mt: 3, mb: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Filtrar por</InputLabel>
                    <Select
                        value={filter}
                        label="Filtrar por"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="fecha">Fecha</MenuItem>
                        <MenuItem value="cliente">Cliente</MenuItem>
                        <MenuItem value="cancha">Cancha</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Buscar"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, maxWidth: '300px' }}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownloadExcel}
                    startIcon={<GetAppIcon />}
                >
                    Descargar
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Cancha</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Hora de Inicio</TableCell>
                            <TableCell>Hora de Fin</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservas.map((reserva) => (
                            <TableRow key={reserva.id}>
                                <TableCell>{reserva.client ? `${reserva.client.firstName} ${reserva.client.lastName}` : 'Sin asignar'}</TableCell>
                                <TableCell>{reserva.field ? reserva.field.name : 'Sin asignar'}</TableCell>
                                <TableCell>{reserva.reservationDate}</TableCell>
                                <TableCell>{reserva.startTime}</TableCell>
                                <TableCell>{reserva.endTime}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenModal(reserva)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(reserva)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', backgroundColor: '#3f51b5', color: 'white' }}>
                    Detalles de la Reserva
                </DialogTitle>
                <DialogContent dividers>
                    {selectedReserva && (
                        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                            <Box display="flex" justifyContent="center" mb={2}>
                                <img
                                    src={`${API_BASE_URL}/images/${selectedReserva.payment.img}`}
                                    alt="Imagen de la Reserva"
                                    style={{ borderRadius: '8px', width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                />
                            </Box>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <VisibilityIcon color="primary" sx={{ marginRight: 1 }} />
                                <strong>Cliente:</strong> {`${selectedReserva.client.firstName} ${selectedReserva.client.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <SportsSoccerIcon color="secondary" sx={{ marginRight: 1 }} />
                                <strong>Cancha:</strong> {selectedReserva.field ? selectedReserva.field.name : 'No asignado'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon color="action" sx={{ marginRight: 1 }} />
                                <strong>Fecha de la Reserva:</strong> {selectedReserva.reservationDate}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="action" sx={{ marginRight: 1 }} />
                                <strong>Hora de Inicio:</strong> {selectedReserva.startTime}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="action" sx={{ marginRight: 1 }} />
                                <strong>Hora de Fin:</strong> {selectedReserva.endTime}
                            </Typography>
                            <Divider sx={{ width: '100%', my: 2 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon color="success" sx={{ marginRight: 1 }} />
                                <strong>Pago:</strong> {selectedReserva.payment ? `${selectedReserva.payment.amount} - ${selectedReserva.payment.method.method}` : 'Sin pago asignado'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <StarIcon color="warning" sx={{ marginRight: 1 }} />
                                <strong>Promoción Aplicada:</strong> {selectedReserva.promotion ? `${selectedReserva.promotion.description} (${selectedReserva.promotion.discount}%)` : 'Sin promoción'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Cerrar</Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteReserva}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la reserva de ${selectedReserva ? selectedReserva.client.firstName : ''} ${selectedReserva ? selectedReserva.client.lastName : ''}?`}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarType === 'success' ? successMessage : errorMessage}
            />
        </Box>
    );
};

export default ReservasAdmin;