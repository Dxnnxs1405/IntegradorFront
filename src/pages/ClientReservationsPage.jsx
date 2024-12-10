import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { API_BASE_URL, useUser } from '../context/UserContext';
import EventIcon from '@mui/icons-material/Event';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ClientReservationsPage = () => {
    const { user, token } = useUser();
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservation/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: '#e0f7fa',
                    borderRadius: 2,
                    mb: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: '#00796b' }}>
                    Mis Reservas
                </Typography>
            </Paper>

            <Grid container spacing={4}>
                {reservations.length > 0 ? (
                    reservations.map((reservation) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        height: '100%',
                                        backgroundColor: '#ffffff',
                                        boxShadow: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    {/* Icono de Fútbol */}
                                    <SportsSoccerIcon sx={{ fontSize: 50, color: '#00796b', mb: 2 }} />

                                    {/* Nombre del Campo */}
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00796b', mb: 1 }}>
                                        {reservation.field.name} - {reservation.field.fieldType.name}
                                    </Typography>

                                    {/* Fecha y Horario */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}
                                    >
                                        <EventIcon sx={{ mr: 0.5 }} />
                                        {reservation.reservationDate}
                                        ({reservation.startTime} - {reservation.endTime})
                                    </Typography>

                                    {/* Duración */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}
                                    >
                                        <AccessTimeIcon sx={{ mr: 0.5 }} />
                                        Duración: {reservation.duration} horas
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })
                ) : (
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                        No tienes reservas.
                    </Typography>
                )}
            </Grid>

            <div style={{ height: '100px' }}></div>
        </Container>
    );
};

export default ClientReservationsPage;
