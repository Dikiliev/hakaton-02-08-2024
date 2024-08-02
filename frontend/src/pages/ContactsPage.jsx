import { Container, Typography, Box, Link, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import ShopIcon from '@mui/icons-material/Shop';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function ContactsPage() {
    return (
        <Container>
            <Box
                gap={'20px'}
                paddingY={'50px'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'start',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Контакты
                </Typography>
                <Box>
                    <Typography variant="body1">
                        <PhoneIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                        +7 (960) 440-70-65
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        <Link href="https://t.me/mdikiy" color="inherit" underline="none">
                            <TelegramIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                            Связаться в Telegram
                        </Link>
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1">
                        <Link href="https://www.avito.ru/user" color="inherit" underline="none">
                            <ShopIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                            Перейти на Avito
                        </Link>
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1">
                        <Link href="https://wa.me/79604407065" color="inherit" underline="none">
                            <WhatsAppIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                            Связаться в WhatsApp
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default ContactsPage;
