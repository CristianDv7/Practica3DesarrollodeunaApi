import type { Request, Response } from 'express';
import type {
  EmployeeInput,
  IEmployeeRepository,
} from '../repositories/IEmployeeRepository.js';
import { sendSuccess } from '../utils/response.js';

export const createEmployeeController = (repository: IEmployeeRepository) => ({
  getEmpleado: async (_req: Request, res: Response): Promise<void> => {
    const employees = await repository.findAll();
    sendSuccess(res, employees, 'Empleados obtenidos correctamente');
  },

  addEmpleado: async (req: Request, res: Response): Promise<void> => {
    const employee = await repository.create(req.body as EmployeeInput);
    sendSuccess(res, employee, 'Empleado guardado', 201);
  },

  updateEmpleado: async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const employee = await repository.updateById(id, req.body as Partial<EmployeeInput>);

    if (!employee) {
      sendSuccess(res, null, 'Empleado no encontrado', 404);
      return;
    }

    sendSuccess(res, employee, 'Empleado actualizado');
  },

  deleteEmpleado: async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await repository.deleteById(id);
    sendSuccess(res, null, 'Empleado eliminado');
  },
});

