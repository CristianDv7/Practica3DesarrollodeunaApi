import { Router } from 'express';
import { createEmployeeController } from '../controllers/empleados.controllers.js';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository.js';
import {
	createEmployeeSchema,
	employeeIdSchema,
	updateEmployeeSchema,
} from '../dtos/employee.dto.js';
import { validate } from '../middleware/validate.js';

export const createEmployeeRoutes = (repository: IEmployeeRepository) => {
const router = Router();
const employeeController = createEmployeeController(repository);

router.get('/empleados', employeeController.getEmpleado);
router.post('/empleados', validate(createEmployeeSchema, 'body'), employeeController.addEmpleado);
router.put(
	'/empleados/:id',
	validate(employeeIdSchema, 'params'),
	validate(updateEmployeeSchema, 'body'),
	employeeController.updateEmpleado,
);
router.delete(
	'/empleados/:id',
	validate(employeeIdSchema, 'params'),
	employeeController.deleteEmpleado,
);

return router;
};