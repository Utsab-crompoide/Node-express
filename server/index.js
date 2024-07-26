import express from 'express'
import { connection} from './postgres/postgres.js'
import route from './routes/routes.js';
import cors from 'cors'
import { swaggerSpec, swaggerUi } from './config/swagger.js';

const app = express();
app.use(express.json())
app.set('view engine', 'ejs');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI
app.use(route);
app.use(cors())
app.use(express.static('public'))

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is Listening at port ${PORT}`)
})

connection()
