import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import type { IEmployeeRepository } from './repositories/IEmployeeRepository.js';
import { createEmployeeRoutes } from './routes/empleados.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';


export const createApp = (employeeRepository: IEmployeeRepository) => {
	const app = express();
	app.use(express.json());
	app.use(cors());
	app.set('puerto', process.env.PORT || 3000);
	app.set('nombreApp', 'Gestión de empleados');
	app.use(morgan('dev'));
	app.use('/api/v1', createEmployeeRoutes(employeeRepository));
	app.use(notFoundHandler);
	app.use(errorHandler);
	return app;
};
