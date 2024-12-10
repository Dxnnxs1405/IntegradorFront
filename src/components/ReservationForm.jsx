import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    Autocomplete,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import {API_BASE_URL} from "../context/UserContext.jsx";
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";

const ReservationForm = ({ open, handleClose, cancha, users, user, token }) => {
    const [reservationDate, setReservationDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [reservationImage, setReservationImage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(user ? user.id : null);
    const [formErrors, setFormErrors] = useState({});
    const [validPromotions, setValidPromotions] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const today = new Date();
        const activePromotions = promotions.filter((promotion) => {
            const startDate = new Date(promotion.start);
            const endDate = new Date(promotion.end);
            return startDate <= today && endDate >= today;
        });
        setValidPromotions(activePromotions);
    }, [promotions]);

    const fetchMethods = async () => {
        try {
            const paymentMethodResponse = await fetch(`${API_BASE_URL}/paymentMethods`);
            const paymentMethodData = await paymentMethodResponse.json();
            setPaymentMethods(paymentMethodData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchPromotions = async () => {
        try {
            const promotionResponse = await fetch(`${API_BASE_URL}/promotion`);
            const promotionData = await promotionResponse.json();
            setPromotions(promotionData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        setSelectedUser(user ? user.id : null);
        fetchMethods();
        fetchPromotions();
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReservationImage(file);
        }
    };

    const handlePromotionChange = (e) => {
        setSelectedPromotion(e.target.value);
    };

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const validateReservationDate = () => {
        const currentDate = new Date();
        const selectedDate = new Date(`${reservationDate}T00:00`);
        if (selectedDate < currentDate) {
            setFormErrors((prev) => ({ ...prev, reservationDate: 'La fecha debe ser igual o posterior a la fecha actual.' }));
            return false;
        }
        return true;
    };

    const validateStartTime = () => {
        if (!reservationDate || !startTime) return false;
        const start = new Date(`${reservationDate}T${startTime}`);
        const end = new Date(`${reservationDate}T${endTime}`);
        if (end <= start) {
            setFormErrors((prev) => ({ ...prev, startTime: 'La hora de inicio debe ser menor que la hora de fin.' }));
            return false;
        }
        return true;
    };

    const validateEndTime = () => {
        if (!startTime || !endTime) return false;
        const start = new Date(`${reservationDate}T${startTime}`);
        const end = new Date(`${reservationDate}T${endTime}`);
        if (end <= start) {
            setFormErrors((prev) => ({ ...prev, endTime: 'La hora de fin debe ser posterior a la hora de inicio.' }));
            return false;
        }
        return true;
    };

    const validatePromotion = () => {
        if (!selectedPromotion) return true;
        const promotion = validPromotions.find(promo => promo.id === selectedPromotion);
        if (!promotion) return false;
        return true;
    };

    const validateForm = () => {
        const errors = {};
        if (!reservationDate) errors.reservationDate = 'Este campo es obligatorio.';
        if (!startTime) errors.startTime = 'Este campo es obligatorio.';
        if (!endTime) errors.endTime = 'Este campo es obligatorio.';
        if (!selectedPaymentMethod) errors.selectedPaymentMethod = 'Selecciona un método de pago.';
        if (!reservationImage) errors.reservationImage = 'Por favor, selecciona una imagen para la reserva.';
        if (!validatePromotion()) errors.selectedPromotion = 'La promoción seleccionada no es válida para esta fecha.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleReserve = async () => {
        if (!validateForm()) return;
        if (!validateReservationDate() || !validateStartTime() || !validateEndTime()) return;

        const formData = new FormData();
        formData.append('image', reservationImage);

        try {
            const imageResponse = await fetch(`${API_BASE_URL}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!imageResponse.ok) {
                throw new Error('Error al subir la imagen');
            }

            const imageName = await imageResponse.text();

            const reservationData = {
                reservation: {
                    reservationDate: reservationDate,
                    startTime: startTime,
                    endTime: endTime,
                    fieldId: cancha.id,
                    promotionId: selectedPromotion,
                    clientId: selectedUser,
                },
                payment: {
                    amount: cancha.hourlyRate,
                    methodId: selectedPaymentMethod,
                    image: imageName,
                },
            };

            const reservationResponse = await fetch(`${API_BASE_URL}/reservation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (!reservationResponse.ok) {
                const errorMessage = 'Error al reservar la cancha, ya está reservada para esta fecha y hora.';
                throw new Error(errorMessage);
            }

            setSuccessDialogOpen(true);
            handleClose();
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography variant="h6">
                    Reservar {cancha?.name}
                    <IconButton onClick={handleClose} style={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <SportsSoccerIcon sx={{ marginRight: 1, color: '#4caf50' }} />
                            {cancha?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                            <SportsSoccerIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                            Tipo: {cancha?.fieldType?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                            <AttachMoneyIcon sx={{ marginRight: 1, color: '#388e3c' }} />
                            Precio por hora: S/. {cancha?.hourlyRate}
                        </Typography>
                    </CardContent>
                </Card>

                <TextField
                    label="Fecha de Reserva"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    error={!!formErrors.reservationDate}
                    helperText={formErrors.reservationDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    label="Hora de Inicio"
                    type="time"
                    fullWidth
                    margin="normal"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    error={!!formErrors.startTime}
                    helperText={formErrors.startTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    label="Hora de Fin"
                    type="time"
                    fullWidth
                    margin="normal"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    error={!!formErrors.endTime}
                    helperText={formErrors.endTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    select
                    label="Promoción"
                    value={selectedPromotion}
                    onChange={handlePromotionChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.selectedPromotion}
                    helperText={formErrors.selectedPromotion}
                >
                    {validPromotions.map((promotion) => (
                        <MenuItem key={promotion.id} value={promotion.id}>
                            {promotion.description} - {promotion.discount}% -
                            {`${new Date(promotion.start).getDate()}/${new Date(promotion.start).getMonth() + 1}/${new Date(promotion.start).getFullYear()} - 
                            ${new Date(promotion.end).getDate()}/${new Date(promotion.end).getMonth() + 1}/${new Date(promotion.end).getFullYear()}`}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Método de Pago"
                    value={selectedPaymentMethod}
                    onChange={handlePaymentMethodChange}
                    fullWidth
                    margin="normal"
                    error={!!formErrors.selectedPaymentMethod}
                    helperText={formErrors.selectedPaymentMethod}
                >
                    {paymentMethods.map((method) => (
                        <MenuItem key={method.id} value={method.id}>
                            {method.method}
                        </MenuItem>
                    ))}
                </TextField>

                {users.length > 1 && (
                    <Autocomplete
                        value={users.find(user => user.id === selectedUser) || null}
                        onChange={(e, newValue) => setSelectedUser(newValue?.id || '')}
                        disableClearable
                        options={users}
                        getOptionLabel={(option) => `${option.firstName} ${option.middleName} ${option.lastName} (${option.email})`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar Cliente"
                                fullWidth
                                margin="normal"
                                required
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />

                )}

                <TextField
                    type="file"
                    fullWidth
                    margin="normal"
                    onChange={handleImageChange}
                    error={!!formErrors.reservationImage}
                    helperText={formErrors.reservationImage}
                />

                {reservationImage && (
                    <div style={{ marginTop: 16 }}>
                        <Typography variant="body2" color="text.secondary">
                            Imagen seleccionada: {reservationImage.name}
                        </Typography>
                    </div>
                )}

                <Button variant="contained" color="primary" fullWidth onClick={handleReserve}>
                    Confirmar Reserva
                </Button>

                <SuccessDialog
                    open={successDialogOpen}
                    onClose={() => setSuccessDialogOpen(false)}
                    title="¡Éxito!"
                    message="La reserva se ha guardado exitosamente."
                />
                <ErrorDialog
                    open={errorDialogOpen}
                    onClose={() => setErrorDialogOpen(false)}
                    title="Error"
                    message={error}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ReservationForm;