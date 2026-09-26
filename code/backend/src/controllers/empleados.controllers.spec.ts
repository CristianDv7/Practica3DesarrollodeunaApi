import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import type { Request, Response } from 'express';
import { createEmployeeController } from './empleados.controllers.js';
import type { Employee, IEmployeeRepository } from '../repositories/IEmployeeRepository.js';

describe('Pruebas del controlador de empleados (aislamiento del repositorio)', () => {
  let repository: jest.Mocked<IEmployeeRepository>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  });

  it('devuelve la lista de empleados del repositorio sin acceder a la base de datos', async () => {
    const employees: Employee[] = [
      {
        _id: 'employee-1',
        nombre: 'Andrés Mendoza',
        cargo: 'Arquitecto',
        departamento: 'TI',
        sueldo: 4000,
      },
    ];
    repository.findAll.mockResolvedValue(employees);
    const controller = createEmployeeController(repository);
    const response = { status: statusMock } as unknown as Response;

    await controller.getEmpleado({} as Request, response);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleados obtenidos correctamente',
      data: employees,
    });
  });

  it('crea un empleado y responde con estado 201', async () => {
    const employeeInput = {
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4000,
    };
    const employee: Employee = { _id: 'employee-1', ...employeeInput };
    repository.create.mockResolvedValue(employee);
    const controller = createEmployeeController(repository);
    const request = { body: employeeInput } as Request;
    const response = { status: statusMock } as unknown as Response;

    await controller.addEmpleado(request, response);

    expect(repository.create).toHaveBeenCalledWith(employeeInput);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado guardado',
      data: employee,
    });
  });

  it('actualiza un empleado y responde con estado 200', async () => {
    const id = 'employee-1';
    const updates = { cargo: 'Lider tecnico' };
    const employee: Employee = {
      _id: id,
      nombre: 'Andrés Mendoza',
      cargo: 'Lider tecnico',
      departamento: 'TI',
      sueldo: 4000,
    };
    repository.updateById.mockResolvedValue(employee);
    const controller = createEmployeeController(repository);
    const request = { params: { id }, body: updates } as unknown as Request;
    const response = { status: statusMock } as unknown as Response;

    await controller.updateEmpleado(request, response);

    expect(repository.updateById).toHaveBeenCalledWith(id, updates);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado actualizado',
      data: employee,
    });
  });

  it('responde con estado 404 cuando el empleado que se quiere actualizar no existe', async () => {
    const id = 'missing-employee';
    repository.updateById.mockResolvedValue(null);
    const controller = createEmployeeController(repository);
    const request = { params: { id }, body: { cargo: 'Lider tecnico' } } as unknown as Request;
    const response = { status: statusMock } as unknown as Response;

    await controller.updateEmpleado(request, response);

    expect(repository.updateById).toHaveBeenCalledWith(id, { cargo: 'Lider tecnico' });
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado no encontrado',
      data: null,
    });
  });

  it('elimina un empleado y responde con estado 200', async () => {
    const id = 'employee-1';
    repository.deleteById.mockResolvedValue(undefined);
    const controller = createEmployeeController(repository);
    const request = { params: { id } } as unknown as Request;
    const response = { status: statusMock } as unknown as Response;

    await controller.deleteEmpleado(request, response);

    expect(repository.deleteById).toHaveBeenCalledWith(id);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado eliminado',
      data: null,
    });
  });

  it('propaga el error si falla la lectura de empleados', async () => {
    const error = new Error('Error al consultar empleados');
    repository.findAll.mockRejectedValue(error);
    const controller = createEmployeeController(repository);
    const response = { status: statusMock } as unknown as Response;

    await expect(controller.getEmpleado({} as Request, response)).rejects.toBe(error);

    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('propaga el error si falla la creacion de un empleado', async () => {
    const error = new Error('Error al guardar empleado');
    const employeeInput = {
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4000,
    };
    repository.create.mockRejectedValue(error);
    const controller = createEmployeeController(repository);
    const request = { body: employeeInput } as Request;
    const response = { status: statusMock } as unknown as Response;

    await expect(controller.addEmpleado(request, response)).rejects.toBe(error);

    expect(repository.create).toHaveBeenCalledWith(employeeInput);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('propaga el error si falla la actualizacion de un empleado', async () => {
    const error = new Error('Error al actualizar empleado');
    const id = 'employee-1';
    const updates = { cargo: 'Lider tecnico' };
    repository.updateById.mockRejectedValue(error);
    const controller = createEmployeeController(repository);
    const request = { params: { id }, body: updates } as unknown as Request;
    const response = { status: statusMock } as unknown as Response;

    await expect(controller.updateEmpleado(request, response)).rejects.toBe(error);

    expect(repository.updateById).toHaveBeenCalledWith(id, updates);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('propaga el error si falla la eliminacion de un empleado', async () => {
    const error = new Error('Error al eliminar empleado');
    const id = 'employee-1';
    repository.deleteById.mockRejectedValue(error);
    const controller = createEmployeeController(repository);
    const request = { params: { id } } as unknown as Request;
    const response = { status: statusMock } as unknown as Response;

    await expect(controller.deleteEmpleado(request, response)).rejects.toBe(error);

    expect(repository.deleteById).toHaveBeenCalledWith(id);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });
});