import { Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';

const AcademyCard = ({ logo, name, category, professor, contact, facebook }) => {
    return (
        <Card sx={{ maxWidth: 345, margin: 2, backgroundColor: '#e0f7fa' }}>
            <CardMedia
                component="img"
                height="140"
                image={logo}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Profesor:</strong> {professor}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                    <PhoneIcon sx={{ marginRight: 1 }} />
                    <span>{contact}</span>
                </Typography>
                {facebook && (
                    <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                        <FacebookIcon sx={{ marginRight: 1 }} />
                        <Button variant="contained" color="primary" href={facebook} target="_blank" sx={{ marginTop: 1 }}>
                            Facebook
                        </Button>
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AcademyCard;