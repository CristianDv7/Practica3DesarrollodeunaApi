import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';
import { MongoEmployeeRepository } from './repositories/MongoEmployeeRepository.js';

const port = Number(process.env.PORT) || 3000;

await connectDatabase();
const app = createApp(new MongoEmployeeRepository());

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});