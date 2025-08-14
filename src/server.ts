import mongoose from 'mongoose';
import config from 'config';
import app from './app';

const jwtPrivateKey = config.get<string>('JWT_PRIVATE_KEY');

if (!jwtPrivateKey) {
    console.error('ERROR: JWT private key not defined');
    process.exit(1);
}

mongoose
    .connect('mongodb://localhost/express-mongo-starter-kit')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(8000, () => {
            console.log(`Listening on port 8000`);
        });
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB', err);
        process.exit(1);
    });
