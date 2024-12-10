import { useState, useEffect } from 'react';
import {
    Typography, Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, TextField, Stack, MenuItem, FormControl, FormHelperText, Select, InputLabel, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useUser, API_BASE_URL } from '../context/UserContext';
import ConfirmationDialog from './ConfirmationDialog';
import axios from 'axios';
import {ErrorDialog, SuccessDialog} from "./SuccessErrorDialog.jsx";
import RegisterForm from "./RegisterForm.jsx";

const UsersAdmin = () => {
    const { user, token } = useUser();
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [errors, setErrors] = useState({});
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [token]);

    const handleRoleChange = (e) => {
        setNewRole(e.target.value);
    };

    const roles = user.role === 'ADMIN'
        ? ['CUSTOMER', 'EMPLOYEE', 'ADMIN']
        : ['CUSTOMER'];

    const handleUpdateRole = async () => {
        if (!newRole) {
            setErrors({ role: 'Debe seleccionar un rol' });
            return;
        }

        try {
            await axios.put(
                `${API_BASE_URL}/user/updateRole`,
                { userId: selectedUsuario.id, role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((user) =>
                    user.id === selectedUsuario.id ? { ...user, role: newRole } : user
                )
            );

            setOpenEditDialog(false);
            setSuccessDialogOpen(true);
            fetchUsuarios();
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            setErrors({ role: 'Ocurrió un error al actualizar el rol' });
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleSubmit = async (newUsuario) => {
        try {
            await axios.post(`${API_BASE_URL}/user`, newUsuario, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSuccessDialogOpen(true);
            setOpenAddDialog(false);
            fetchUsuarios();
        } catch (error) {
            setError(error.message);
            setSuccessDialogOpen(true);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/user/${selectedUsuario.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOpenDeleteDialog(false);
            setSuccessDialogOpen(true);
            fetchUsuarios();
        } catch (error) {
            setError(error.message);
            setErrorDialogOpen(true);
        }
    };


    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Administración de Usuarios
            </Typography>

            <Box sx={{ flexGrow: 1, margin: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Buscar por nombre o correo"
                        placeholder="Ingrese nombre o correo"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                            flex: 1,
                            height: { xs: 'fit-content', sm: 'auto' },
                            alignSelf: { xs: 'flex-start', sm: 'center' },
                        }}
                    >
                        Agregar
                    </Button>
                </Stack>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Teléfono</TableCell>
                            {user.role==="ADMIN"&&(
                                <TableCell>Rol</TableCell>
                            )}
                            {user.role==="ADMIN"&&(
                                <TableCell>Acciones</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios
                            .filter(
                                (usuario) =>
                                    usuario.firstName
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    usuario.email
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                            )
                            .map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>
                                        {`${usuario.firstName} ${usuario.middleName}`}
                                    </TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.phone}</TableCell>
                                    {user.role==="ADMIN"&&(
                                        <TableCell>{usuario.role}</TableCell>
                                    )}
                                    {user.role==="ADMIN"&&(
                                        <TableCell>
                                            <IconButton
                                                edge="end"
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedUsuario(usuario);
                                                    setNewRole(usuario.role);
                                                    setOpenEditDialog(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => {
                                                    setSelectedUsuario(usuario);
                                                    setOpenDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
            >
                <DialogTitle>Agregar Usuario</DialogTitle>
                <DialogContent>
                    <RegisterForm onSubmit={handleSubmit} roles={roles} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
            >
                <DialogTitle>Editar Rol</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth error={!!errors.role}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={newRole}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value="ADMIN">Administrador</MenuItem>
                            <MenuItem value="EMPLOYEE">Empleado</MenuItem>
                            <MenuItem value="CUSTOMER">Cliente</MenuItem>
                        </Select>
                        <FormHelperText>{errors.role}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateRole}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                open={openDeleteDialog}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUsuario?.firstName || 'Usuario'}"?`}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
            />
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

export default UsersAdmin;