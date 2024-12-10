import React from 'react';
import { Card, CardMedia, CardContent, Button, Typography } from '@mui/material';
import ImgDefault from '../img/default.jpg';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CanchaCard = ({ name, type, price, image, onReserve }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleReservation = () => {
        if (user) {
            onReserve();
        } else {
            navigate('/login');
        }
    };

    return (
        <Card sx={{ maxWidth: 345, margin: 2, backgroundColor: '#ffffff', boxShadow: 3, borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardMedia
                component="img"
                height="180"
                image={image || ImgDefault}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <SportsSoccerIcon sx={{ marginRight: 1, color: '#4caf50' }} />
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                    <SportsSoccerIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                    Tipo: {type}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                    <AttachMoneyIcon sx={{ marginRight: 1, color: '#388e3c' }} />
                    Precio por hora: S/. {price}
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginTop: 2, backgroundColor: '#00796b', width: '100%' }} onClick={handleReservation} startIcon={<CalendarTodayIcon />}>Alquilar</Button>
            </CardContent>
        </Card>
    );
};

export default CanchaCard;