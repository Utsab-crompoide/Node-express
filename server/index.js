import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connection } from './postgres/postgres.js';
import route from './routes/routes.js';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './config/swagger.js';
import cookieParser from 'cookie-parser';
import { currentUser } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/assets', express.static(join(__dirname, 'assets')));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(route);

// app.use(currentUser);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is Listening at port ${PORT}`);
});

connection();