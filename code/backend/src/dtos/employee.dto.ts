import { z } from 'zod';

const employeeFields = {
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  cargo: z.string().trim().min(1, 'El cargo es obligatorio'),
  departamento: z.string().trim().min(1, 'El departamento es obligatorio'),
  sueldo: z.number().finite().positive('El sueldo debe ser mayor que cero'),
};

export const createEmployeeSchema = z.object(employeeFields).strict();

export const updateEmployeeSchema = createEmployeeSchema.partial().strict();

export const employeeIdSchema = z.object({
  id: z.string().trim().min(1, 'El id del empleado es obligatorio'),
}).strict();

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;