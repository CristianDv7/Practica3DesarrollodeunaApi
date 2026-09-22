import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeInput } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Output() readonly save = new EventEmitter<EmployeeInput>();
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    cargo: ['', Validators.required],
    departamento: ['', Validators.required],
    sueldo: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['employee']) return;
    this.form.reset(this.employee
      ? { nombre: this.employee.nombre, cargo: this.employee.cargo, departamento: this.employee.departamento, sueldo: this.employee.sueldo }
      : { nombre: '', cargo: '', departamento: '', sueldo: 0 });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.getRawValue());
    if (!this.employee) this.form.reset({ nombre: '', cargo: '', departamento: '', sueldo: 0 });
  }
}
