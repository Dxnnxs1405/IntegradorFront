import { useState } from 'react';
import { useUser, API_BASE_URL } from '../context/UserContext.jsx';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Alert,
    Grid,
    TextField
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RegisterForm from "../components/RegisterForm.jsx";

const AuthPage = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);

    // Estados para Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginErrors, setLoginErrors] = useState({
        email: false,
        password: false,
    });

    // Lógica de inicio de sesión
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const newLoginErrors = {
            email: !loginEmail,
            password: !loginPassword,
        };

        setLoginErrors(newLoginErrors);

        if (Object.values(newLoginErrors).includes(true)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                const { user, token } = data;
                login(user, token);
                navigate(user.role === 'CUSTOMER' ? '/' : '/admin');
            } else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Ocurrió un error al iniciar sesión.');
            console.error('Error en el inicio de sesión:', error);
        }
    };

    const handleRegisterSubmit = async (userData) => {
        console.log("userData", userData);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                const { user, token } = data;
                login(user, token);
                navigate('/');
            } else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Ocurrió un error al registrarse.');
            console.error('Error en el registro:', error);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#e0f2f1' }}
        >
            <Container maxWidth="sm">
                <Paper elevation={5} sx={{ padding: 5, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <AccountCircleIcon sx={{ fontSize: 60, color: '#00796b', marginBottom: 2 }} />
                        <Typography variant="h4" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold' }}>
                            {isRegister ? 'Registro' : 'Iniciar Sesión'}
                        </Typography>
                        {isRegister ? (
                            <RegisterForm onSubmit={handleRegisterSubmit} />
                        ) : (
                            <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            type="email"
                                            error={loginErrors.email}
                                            helperText={loginErrors.email && 'Este campo es obligatorio'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contraseña"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            type="password"
                                            error={loginErrors.password}
                                            helperText={loginErrors.password && 'Este campo es obligatorio'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            fullWidth
                                            sx={{ backgroundColor: '#00796b', color: '#ffffff', fontWeight: 'bold' }}
                                            startIcon={<LoginIcon />}
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                        {loginError && (
                            <Alert severity="error" sx={{ marginTop: 2 }}>
                                {loginError}
                            </Alert>
                        )}
                        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                            <Button onClick={() => setIsRegister(!isRegister)} sx={{ color: '#00796b', fontWeight: 'bold' }}>
                                {isRegister ? 'Ya tienes una cuenta? Inicia sesión' : 'No tienes una cuenta? Regístrate'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthPage;