import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// eslint-disable-next-line react/prop-types
const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#d32f2f' }}>
                <WarningAmberIcon color="error" /> {title}
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ fontSize: '1.1rem', color: '#555' }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" sx={{ textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="error" sx={{ textTransform: 'none' }}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;