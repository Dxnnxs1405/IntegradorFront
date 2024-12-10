import { useState, useEffect } from 'react';
import {
    TextField, Button, Grid, InputAdornment, IconButton, Alert,
} from '@mui/material';
import {
    PersonOutline as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    AppRegistration as RegisterIcon
} from '@mui/icons-material';

const RegisterForm = ({ onSubmit, roles = [] }) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRole, setSelectedRole] = useState(roles.length > 0 ? '' : 'CUSTOMER');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles]);

    const validateFields = () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const phoneRegex = /^[0-9]{9}$/;

        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = 'El primer nombre es obligatorio';
        if (!middleName.trim()) newErrors.middleName = 'El segundo nombre es obligatorio';
        if (!lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
        if (!email.trim()) newErrors.email = 'El email es obligatorio';
        if (!phone || !phoneRegex.test(phone)) {
            newErrors.phone = 'El número debe tener exactamente 9 dígitos';
        }
        if (!password || !passwordRegex.test(password)) {
            newErrors.password = 'Debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (roles.length > 0 && !selectedRole) {
            newErrors.role = 'El rol es obligatorio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateFields()) {
            setIsSubmitting(false);
            return;
        }

        console.log({ firstName, middleName, lastName, email, password, phone, role: selectedRole });

        onSubmit({ firstName, middleName, lastName, email, password, phone, role: selectedRole });
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Primer Nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Segundo Nombre"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        error={!!errors.middleName}
                        helperText={errors.middleName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        label="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Teléfono"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 9) {
                                setPhone(value);
                            }
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {roles.length > 0 && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Rol"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            error={!!errors.role}
                            helperText={errors.role}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ backgroundColor: '#00796b', color: '#ffffff', fontWeight: 'bold' }}
                        startIcon={<RegisterIcon />}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar'}
                    </Button>
                </Grid>
            </Grid>
            {Object.values(errors).includes(true) && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                    Por favor, corrige los errores del formulario.
                </Alert>
            )}
        </form>
    );
};

export default RegisterForm;