export interface Employee {
  _id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeInput = Omit<Employee, '_id' | 'createdAt' | 'updatedAt'>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
