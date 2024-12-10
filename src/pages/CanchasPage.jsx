import { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import ImgDefault from '../img/default.jpg';
import { useUser } from '../context/UserContext';
import {API_BASE_URL} from "../context/UserContext.jsx";
import CanchaCard from "../components/CanchaCard.jsx";
import ReservationForm from "../components/ReservationForm.jsx";

const CanchasPage = () => {
    const { user, token } = useUser();
    const [canchas, setCanchas] = useState([]);
    const [openReservationModal, setOpenReservationModal] = useState(false);
    const [selectedCancha, setSelectedCancha] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const canchaResponse = await fetch(`${API_BASE_URL}/field`);
                const canchaData = await canchaResponse.json();
                setCanchas(canchaData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleOpenReservationModal = (cancha) => {
        if (user) {
            setSelectedCancha(cancha);
            setOpenReservationModal(true);
        } else {
            window.location.href = '/login';
        }
    };

    const handleCloseReservationModal = () => {
        setOpenReservationModal(false);
        setSelectedCancha(null);
    };

    return (
        <div>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Reservar Canchas
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={2}>
                        {canchas.map((cancha) => (
                            <Grid item xs={12} sm={6} md={4} key={cancha.id}>
                                <CanchaCard
                                    name={cancha.name}
                                    type={cancha.fieldType.name}
                                    price={cancha.hourlyRate}
                                    image={cancha.image || ImgDefault}
                                    onReserve={() => handleOpenReservationModal(cancha)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {openReservationModal && selectedCancha && (
                <ReservationForm
                    open={openReservationModal}
                    handleClose={handleCloseReservationModal}
                    cancha={selectedCancha}
                    users={user}
                    user={user}
                    token={token}
                />
            )}
        </div>
    );
};

export default CanchasPage;