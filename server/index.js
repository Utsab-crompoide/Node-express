import express from 'express'
import { connection} from './postgres/postgres.js'
import route from './routes/routes.js';
import cors from 'cors'
import { swaggerSpec, swaggerUi } from './swagger.js';

const app = express();
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI
app.use(route);
app.use(cors())

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is Listening at port ${PORT}`)
})

connection()
