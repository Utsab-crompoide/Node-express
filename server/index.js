import express from 'express'
import { connection} from './postgres/postgres.js'
import route from './routes/routes.js';
import cors from 'cors'
import { swaggerSpec, swaggerUi } from './config/swagger.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI
app.use(express.json())
app.use(cookieParser())
app.use(route);
app.use(cors())
app.use(express.static('public'))
app.set('view engine', 'ejs');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is Listening at port ${PORT}`)
})

connection()
