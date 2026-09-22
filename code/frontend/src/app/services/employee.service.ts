import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { ApiResponse, Employee, EmployeeInput } from '../models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1/empleados';
  private readonly employeesSubject = new BehaviorSubject<readonly Employee[]>([]);
  private readonly feedbackSubject = new BehaviorSubject<string>('');

  readonly employees$: Observable<readonly Employee[]> = this.employeesSubject.asObservable();
  readonly feedback$: Observable<string> = this.feedbackSubject.asObservable();

  loadEmployees(): void {
    this.http.get<ApiResponse<Employee[]>>(this.apiUrl).pipe(
      map((response) => response.data),
      tap((employees) => this.replaceEmployees(employees)),
    ).subscribe({ error: () => this.feedbackSubject.next('No se pudieron cargar los empleados.') });
  }

  createEmployee(employee: EmployeeInput): void {
    this.http.post<ApiResponse<Employee>>(this.apiUrl, employee).pipe(
      map((response) => response.data),
      tap((createdEmployee) => this.appendEmployee(createdEmployee)),
    ).subscribe({
      next: () => this.feedbackSubject.next('Empleado creado.'),
      error: () => this.feedbackSubject.next('No se pudo guardar el empleado.'),
    });
  }

  updateEmployee(id: string, employee: EmployeeInput): void {
    this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, employee).pipe(
      map((response) => response.data),
      tap((updatedEmployee) => this.replaceEmployee(updatedEmployee)),
    ).subscribe({
      next: () => this.feedbackSubject.next('Empleado actualizado.'),
      error: () => this.feedbackSubject.next('No se pudo guardar el empleado.'),
    });
  }

  deleteEmployee(id: string): void {
    this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => this.removeEmployee(id)),
    ).subscribe({
      next: () => this.feedbackSubject.next('Empleado eliminado.'),
      error: () => this.feedbackSubject.next('No se pudo eliminar el empleado.'),
    });
  }

  private replaceEmployees(employees: readonly Employee[]): void {
    this.employeesSubject.next([...employees]);
  }

  private appendEmployee(employee: Employee): void {
    this.employeesSubject.next([...this.employeesSubject.value, employee]);
  }

  private replaceEmployee(updatedEmployee: Employee): void {
    this.employeesSubject.next(
      this.employeesSubject.value.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee,
      ),
    );
  }

  private removeEmployee(id: string): void {
    this.employeesSubject.next(
      this.employeesSubject.value.filter((employee) => employee._id !== id),
    );
  }
}
