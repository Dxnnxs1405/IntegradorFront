import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: 3, backgroundColor: '#00796b', color: '#ffffff', marginTop: 'auto' }}>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                Av Misericordia-Monsefu
            </Typography>
            <Box>
                <IconButton href="https://www.facebook.com" target="_blank" color="inherit">
                    <FacebookIcon />
                </IconButton>
                <IconButton href="https://www.twitter.com" target="_blank" color="inherit">
                    <TwitterIcon />
                </IconButton>
                <IconButton href="https://www.instagram.com" target="_blank" color="inherit">
                    <InstagramIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Footer;