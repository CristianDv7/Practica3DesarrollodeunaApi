import EmployeeModel from '../models/empleado.js';
import type {
  Employee,
  EmployeeInput,
  IEmployeeRepository,
} from './IEmployeeRepository.js';

export class MongoEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    return EmployeeModel.find().lean<Employee[]>().exec();
  }

  async create(data: EmployeeInput): Promise<Employee> {
    const employee = await EmployeeModel.create(data);
    return employee.toObject() as unknown as Employee;
  }

  async updateById(
    id: string,
    data: Partial<EmployeeInput>,
  ): Promise<Employee | null> {
    return EmployeeModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Employee>()
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await EmployeeModel.findByIdAndDelete(id).exec();
  }
}