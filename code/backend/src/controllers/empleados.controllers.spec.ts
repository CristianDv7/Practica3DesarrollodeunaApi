import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import type { Request, Response } from 'express';
import { createEmployeeController } from './empleados.controllers.js';
import type { Employee, IEmployeeRepository } from '../repositories/IEmployeeRepository.js';

describe('Employee controller (repository isolation)', () => {
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

  it('returns employees from the repository abstraction without accessing the database', async () => {
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
});