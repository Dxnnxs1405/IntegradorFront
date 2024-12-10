import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// eslint-disable-next-line react/prop-types
const SuccessDialog = ({ open, onClose, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#388e3c' }}>
                <CheckCircleIcon color="success" /> {title}
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ fontSize: '1.1rem', color: '#555' }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" sx={{ textTransform: 'none' }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// eslint-disable-next-line react/prop-types
const ErrorDialog = ({ open, onClose, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#d32f2f' }}>
                <ErrorIcon color="error" /> {title}
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ fontSize: '1.1rem', color: '#555' }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" sx={{ textTransform: 'none' }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { SuccessDialog, ErrorDialog };