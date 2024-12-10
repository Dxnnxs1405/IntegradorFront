import { useState } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    DialogContentText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import DashboardAdmin from '../components/DashboardAdmin';
import Canchas from '../components/CanchasAdmin';
import ReservasAdmin from '../components/ReservasAdmin';
import UsersAdmin from '../components/UsersAdmin.jsx';
import EditarCuenta from '../components/EditarCuenta';
import TiposCanchasAdmin from '../components/TiposCanchasAdmin';
import MetodosPagoAdmin from '../components/MetodosPagoAdmin';
import Promociones from '../components/Promociones';

const drawerWidth = 260;

const AdminPage = () => {
    const { logout, user } = useUser();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('Dashboard');
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setOpenLogoutDialog(false);
        navigate('/');
    };

    const renderSection = () => {
        switch (selectedSection) {
            case 'Dashboard':
                return <DashboardAdmin />;
            case 'Canchas':
                return <Canchas />;
            case 'Reservas':
                return <ReservasAdmin />;
            case 'Usuarios':
                return <UsersAdmin />;
            case 'Editar Cuenta':
                return <EditarCuenta />;
            case 'Tipos de Canchas':
                return <TiposCanchasAdmin />;
            case 'Métodos de Pago':
                return <MetodosPagoAdmin />;
            case 'Promociones':
                return <Promociones />;
            default:
                return <DashboardAdmin />;
        }
    };

    const drawerItems = user.role === 'ADMIN' ? [
        { label: 'Dashboard', icon: <DashboardIcon />, color: '#00796b' },
        { label: 'Canchas', icon: <SportsSoccerIcon />, color: '#4caf50' },
        { label: 'Reservas', icon: <EventIcon />, color: '#1976d2' },
        { label: 'Usuarios', icon: <PeopleIcon />, color: '#388e3c' },
        { label: 'Tipos de Canchas', icon: <ListAltIcon />, color: '#ff9800' },
        { label: 'Métodos de Pago', icon: <PaymentIcon />, color: '#673ab7' },
        { label: 'Promociones', icon: <LocalOfferIcon />, color: '#f44336' },
    ] : [
        { label: 'Dashboard', icon: <DashboardIcon />, color: '#00796b' },
        { label: 'Canchas', icon: <SportsSoccerIcon />, color: '#4caf50' },
        { label: 'Reservas', icon: <EventIcon />, color: '#1976d2' },
        { label: 'Usuarios', icon: <PeopleIcon />, color: '#388e3c' },
    ];

    const commonDrawerItems = [
        { label: 'Editar Cuenta', icon: <AccountCircleIcon />, color: '#4caf50', onClick: () => handleSectionChange('Editar Cuenta') },
        {
            label: 'Cerrar Sesión',
            icon: <ExitToAppIcon />,
            color: '#e57373',
            onClick: handleLogoutClick
        },
    ];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {drawerItems.map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => handleSectionChange(item.label)}
                        sx={{
                            bgcolor: selectedSection === item.label ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            borderRadius: 2,
                            color: selectedSection === item.label ? '#ffffff' : '#b0bec5',
                            "&:hover": {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: item.color }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                {commonDrawerItems.map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={item.onClick}
                        sx={{
                            borderRadius: 2,
                            color: item.color,
                            "&:hover": {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: item.color }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: '#00796b',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Panel de Administración
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="sidebar"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#263238', color: '#ffffff' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#263238', color: '#ffffff' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    overflowY: 'auto', // Para permitir el desplazamiento si es necesario
                }}
            >
                <Toolbar />
                {renderSection()}
            </Box>

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#d32f2f' }}>
                    <WarningAmberIcon color="error" /> Confirmar Cierre de Sesión
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '1.1rem', color: '#555' }}>
                        ¿Estás seguro de que deseas cerrar sesión?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="error">
                        Cerrar Sesión
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;