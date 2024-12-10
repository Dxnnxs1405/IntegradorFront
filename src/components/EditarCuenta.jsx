import { useState } from 'react';
import { Typography, Box, Paper, TextField, Button, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { API_BASE_URL, useUser } from '../context/UserContext';
import { SuccessDialog, ErrorDialog } from './SuccessErrorDialog.jsx';

const EditarCuenta = () => {
    const { user, token, login } = useUser();
    const [accountData, setAccountData] = useState({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    firstName: accountData.firstName,
                    middleName: accountData.middleName,
                    lastName: accountData.lastName,
                    email: accountData.email,
                    phone: accountData.phone,
                    password: accountData.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar los cambios');
            }

            const responseData = await response.json();
            login(responseData.user, responseData.token);
            setSuccessDialogOpen(true);
        } catch (error) {
            setErrorDialogOpen(true);
            setError(error.message);
        }
    };

    return (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom>
                Editar Cuenta
            </Typography>
            <Typography>Aquí puedes actualizar la información de tu cuenta.</Typography>

            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#e0f7fa', mt: 3 }}>
                {/* Usando Grid para el diseño responsivo */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <PersonIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="firstName"
                                value={accountData.firstName}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <PersonIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                fullWidth
                                label="Segundo Nombre"
                                name="middleName"
                                value={accountData.middleName}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <PersonIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                fullWidth
                                label="Apellidos"
                                name="lastName"
                                value={accountData.lastName}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <PhoneIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                label="Teléfono"
                                name="phone"
                                value={accountData.phone}
                                onChange={handleChange}
                                variant="outlined"
                                type="tel"
                                inputProps={{ maxLength: 10 }}
                                sx={{ width: '100%' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <EmailIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                name="email"
                                value={accountData.email}
                                onChange={handleChange}
                                type="email"
                                variant="outlined"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <LockIcon sx={{ color: '#00796b', mr: 1 }} />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                value={accountData.password}
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            />
                            <Button onClick={() => setShowPassword(!showPassword)} sx={{ ml: 1 }}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Botón para guardar */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ mt: 2, backgroundColor: '#00796b', width: '100%' }}
                >
                    Guardar Cambios
                </Button>
            </Paper>

            {/* Diálogos de éxito y error */}
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

export default EditarCuenta;