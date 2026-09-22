export interface EmployeeInput {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

export interface Employee extends EmployeeInput {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  create(data: EmployeeInput): Promise<Employee>;
  updateById(id: string, data: Partial<EmployeeInput>): Promise<Employee | null>;
  deleteById(id: string): Promise<void>;
}