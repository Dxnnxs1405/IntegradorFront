import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, Avatar, Divider } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import TodayIcon from '@mui/icons-material/Today';
import { API_BASE_URL, useUser } from '../context/UserContext';
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const { token, user } = useUser();
    const [stats, setStats] = useState({
        totalCanchas: 0,
        totalAdministradores: 0,
        reservasHoy: 0,
        clientesActivos: 0,
    });
    const [reservasRecientes, setReservasRecientes] = useState([]);

    const fetchCanchas = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/field`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-store',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener canchas: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setStats(prevStats => ({ ...prevStats, totalCanchas: data.length }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/admins`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-store',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener administradores: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setStats(prevStats => ({ ...prevStats, totalAdministradores: data.length }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/customers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-store',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener clientes activos: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setStats(prevStats => ({ ...prevStats, clientesActivos: data.length }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReservas = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-store',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error al obtener reservas: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const today = new Date().toISOString().split('T')[0];

            const reservasHoy = data.filter(reserva => reserva.reservationDate === today).length;
            const recientes = data.slice(0, 5);

            setStats(prevStats => ({ ...prevStats, reservasHoy }));
            setReservasRecientes(recientes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user.role === 'CUSTOMER') {
            navigate('/');
        } else {
            fetchCanchas();
            fetchAdmins();
            fetchClientes();
            fetchReservas();
        }
    }, [user, navigate]);

    return (
        <Box>
            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#e3f2fd', mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Dashboard
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {[
                    { label: 'Canchas', icon: <SportsSoccerIcon />, value: stats.totalCanchas, color: '#4caf50' },
                    { label: 'Administradores', icon: <PeopleIcon />, value: stats.totalAdministradores, color: '#00796b' },
                    { label: 'Reservas de Hoy', icon: <EventIcon />, value: stats.reservasHoy, color: '#1976d2' },
                    { label: 'Clientes Activos', icon: <AccountCircleIcon />, value: stats.clientesActivos, color: '#388e3c' }
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={3} sx={{
                            padding: 2, display: 'flex', alignItems: 'center',
                            height: '100%', justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <Avatar sx={{ bgcolor: item.color, mr: 2, width: 56, height: 56 }}>
                                {item.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" color="text.primary">{item.label}</Typography>
                                <Typography variant="h4" color="primary">{item.value}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4}>
                <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Reservas Recientes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                        {reservasRecientes.map((reserva, index) => (
                            <Paper
                                key={index}
                                elevation={1}
                                sx={{
                                    padding: 2,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    backgroundColor: '#ffffff'
                                }}
                            >
                                <EventIcon sx={{ color: '#1976d2', mr: 2, fontSize: '2rem' }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                        {reserva.client ? `${reserva.client.firstName} ${reserva.client.lastName}` : 'Sin asignar'}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1} mb={0.5}>
                                        <TodayIcon sx={{ color: '#9e9e9e', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{reserva.reservationDate}</strong>
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={0.5}>
                                        <PlaceIcon sx={{ color: '#9e9e9e', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Cancha: <strong>{reserva.field ? reserva.field.name : 'Sin asignar'}</strong>
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <AccessTimeIcon sx={{ color: '#9e9e9e', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {reserva.startTime} - {reserva.endTime}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default DashboardAdmin;