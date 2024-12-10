import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { useUser } from '../context/UserContext';
import LoginIcon from '@mui/icons-material/Login';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import prismaLogo from '../img/prisma-logo.jpg';
import { useNavigate } from 'react-router-dom';
import EditarCuenta from "./EditarCuenta.jsx";

const Header = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleLogoutClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
        setOpen(false);
        navigate('/');
    };

    const handleMobileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setMobileMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMobileMenuClose();
    };

    const mobileMenu = (
        <Menu
            anchorEl={anchorEl}
            open={mobileMenuOpen}
            onClose={handleMobileMenuClose}
            sx={{
                display: { xs: 'block', sm: 'none' },
            }}
        >
            <MenuItem onClick={() => handleNavigation('/')}>Canchas</MenuItem>
            <MenuItem onClick={() => handleNavigation('/academies')}>Academias</MenuItem>
            {user ? (
                <>
                    <MenuItem onClick={() => handleNavigation('/client-reservations')}>Mis Reservas</MenuItem>
                    <MenuItem onClick={() => setEditDialogOpen(true)}>Editar Cuenta</MenuItem>
                    <MenuItem onClick={handleLogoutClick}>Cerrar Sesión</MenuItem>
                </>
            ) : (
                <MenuItem onClick={() => handleNavigation('/login')}>Iniciar Sesión</MenuItem>
            )}
        </Menu>
    );

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#00796b', boxShadow: 3 }} className="header">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <SportsSoccerIcon sx={{ marginRight: 1 }} />
                        ALQUILER CANCHA
                    </Typography>

                    {/* Logo */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                        <img
                            src={prismaLogo}
                            alt="Prisma Logo"
                            style={{ height: '40px', marginRight: '16px' }}
                        />
                    </Box>

                    {/* Menu icon for mobile */}
                    <IconButton
                        color="inherit"
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                        onClick={handleMobileMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                        <Button color="inherit" startIcon={<SportsSoccerIcon />} onClick={() => handleNavigation('/')} sx={{ textTransform: 'none', marginRight: 1 }}>
                            Canchas
                        </Button>
                        <Button color="inherit" startIcon={<SchoolIcon />} onClick={() => handleNavigation('/academies')} sx={{ textTransform: 'none', marginRight: 1 }}>
                            Academias
                        </Button>

                        {user ? (
                            <>
                                <Typography variant="body1" sx={{ marginRight: 2 }}>
                                    Hola, {user.firstName}
                                </Typography>
                                <Button color="inherit" startIcon={<SchoolIcon />} onClick={() => handleNavigation('/client-reservations')} sx={{ textTransform: 'none', marginRight: 1 }}>
                                    Mis Reservas
                                </Button>
                                <Button color="inherit" startIcon={<SchoolIcon />} onClick={() => setEditDialogOpen(true)} sx={{ textTransform: 'none', marginRight: 1 }}>
                                    Editar Cuenta
                                </Button>
                                <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogoutClick} sx={{ textTransform: 'none' }}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => handleNavigation('/login')} startIcon={<LoginIcon />} sx={{ textTransform: 'none' }}>
                                Iniciar Sesión
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {mobileMenu}

            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#d32f2f' }}>
                    <WarningAmberIcon color="error" /> Confirmar Cerrar Sesión
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '1.1rem', color: '#555' }}>
                        ¿Estás seguro de que deseas cerrar sesión?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmLogout} color="error" startIcon={<CheckCircleIcon />} sx={{ textTransform: 'none', fontWeight: 'bold' }} autoFocus>
                        Cerrar Sesión
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogContent>
                    <EditarCuenta />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Header;