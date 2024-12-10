import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, FormHelperText } from '@mui/material';

const CanchaForm = ({ open, onClose, selectedCancha = null, fieldTypes, onSave }) => {
    const [newCancha, setNewCancha] = useState({
        name: '',
        hourlyRate: '',
        fieldTypeId: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedCancha) {
            setNewCancha({
                name: selectedCancha.name,
                hourlyRate: selectedCancha.hourlyRate,
                fieldTypeId: selectedCancha.fieldTypeId,
            });
        }
    }, [selectedCancha]);

    const validate = () => {
        const newErrors = {};
        if (!newCancha.name) newErrors.name = 'El nombre es obligatorio';
        if (!newCancha.hourlyRate) newErrors.hourlyRate = 'El precio por hora es obligatorio';
        if (!newCancha.fieldTypeId) newErrors.fieldTypeId = 'Debe seleccionar un tipo de cancha';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(newCancha);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{selectedCancha ? 'Editar Cancha' : 'Agregar Nueva Cancha'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Nombre de la Cancha"
                    fullWidth
                    variant="outlined"
                    value={newCancha.name}
                    onChange={(e) => setNewCancha({ ...newCancha, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    margin="dense"
                    label="Precio por Hora"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={newCancha.hourlyRate}
                    onChange={(e) => setNewCancha({ ...newCancha, hourlyRate: e.target.value })}
                    error={!!errors.hourlyRate}
                    helperText={errors.hourlyRate}
                />
                <FormControl fullWidth sx={{ marginBottom: 2 }} error={!!errors.fieldTypeId}>
                    <InputLabel>Tipo de Cancha</InputLabel>
                    <Select
                        value={newCancha.fieldTypeId}
                        onChange={(e) => setNewCancha({ ...newCancha, fieldTypeId: e.target.value })}
                    >
                        {fieldTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.fieldTypeId && <FormHelperText>{errors.fieldTypeId}</FormHelperText>}
                </FormControl>
                <Button onClick={handleSave} color="primary" variant="contained" sx={{ mt: 2 }}>
                    {selectedCancha ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CanchaForm;