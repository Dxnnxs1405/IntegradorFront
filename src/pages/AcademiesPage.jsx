import React from 'react';
import { Container, Grid, Typography, Paper, Avatar, IconButton, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CallIcon from '@mui/icons-material/Call';
import SchoolIcon from '@mui/icons-material/School';

import ajaxLogo from '../img/ajax.jpeg';
import aurichLogo from '../img/aurich.jpeg';
import cfcLogo from '../img/cfc.jpeg';
import sanlorenzoLogo from '../img/Sanlorenzodechiclayo.png';

const academies = [
    {
        logo: sanlorenzoLogo,
        name: 'Club Deportivo San Lorenzo de Almagro',
        category: 'Categoría 2003-2011',
        professor: 'Profesor Alarcon',
        contact: '994475411',
        facebook: 'https://facebook.com',
    },
    {
        logo: cfcLogo,
        name: 'Chiclayo Futbol Club',
        category: 'Categoría 2005-2010',
        professor: 'Profesor Perez',
        contact: '9714444753',
        facebook: 'https://facebook.com',
    },
    {
        logo: aurichLogo,
        name: 'Club Juan Aurich',
        category: 'Categoría 2007-2017',
        professor: 'Profesor Vizcarra',
        contact: '(074) 632163',
        facebook: 'https://facebook.com',
    },
    {
        logo: ajaxLogo,
        name: 'Ajax FC',
        category: 'Categoría 2006-2014',
        professor: 'Profesor Chunpi',
        contact: '994475411',
        facebook: 'https://facebook.com',
    },
];

const AcademiesPage = () => {
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
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: '#00796b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontSize: '2rem',
                    }}
                >
                    <SportsSoccerIcon fontSize="large" /> Academias
                </Typography>
            </Paper>

            <Grid container spacing={4} justifyContent="center">
                {academies.map((academy, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: '#ffffff',
                                borderRadius: 3,
                                textAlign: 'center',
                                height: '100%',
                                boxShadow: 2,
                                overflow: 'hidden',
                            }}
                        >
                            <Avatar src={academy.logo} alt={academy.name} sx={{ width: 80, height: 80, mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00796b', fontSize: '1.1rem' }}>
                                {academy.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    fontSize: '0.9rem',
                                }}
                            >
                                <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: '#00796b' }} /> {academy.category}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    fontSize: '0.9rem',
                                }}
                            >
                                <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: '#00796b' }} /> {academy.professor}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    fontSize: '0.9rem',
                                }}
                            >
                                <CallIcon fontSize="small" sx={{ mr: 0.5, color: '#00796b' }} /> {academy.contact}
                            </Typography>

                            <Box mt={2}>
                                <IconButton
                                    color="primary"
                                    href={academy.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        backgroundColor: '#e3f2fd',
                                        '&:hover': { backgroundColor: '#bbdefb' },
                                    }}
                                >
                                    <FacebookIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AcademiesPage;