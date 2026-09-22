import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { Employee, EmployeeInput } from './models/employee';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, EmployeeFormComponent, EmployeeTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly employees$ = this.employeeService.employees$;
  readonly feedback$ = this.employeeService.feedback$;
  selectedEmployee: Employee | null = null;

  constructor() {
    this.employeeService.loadEmployees();
  }

  saveEmployee(employee: EmployeeInput): void {
    if (this.selectedEmployee?._id) {
      this.employeeService.updateEmployee(this.selectedEmployee._id, employee);
    } else {
      this.employeeService.createEmployee(employee);
    }
    this.selectedEmployee = null;
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
  }

  cancelEdit(): void {
    this.selectedEmployee = null;
  }

  deleteEmployee(employee: Employee): void {
    if (!employee._id || !window.confirm(`¿Eliminar a ${employee.nombre}?`)) return;
    this.employeeService.deleteEmployee(employee._id);
  }
}
