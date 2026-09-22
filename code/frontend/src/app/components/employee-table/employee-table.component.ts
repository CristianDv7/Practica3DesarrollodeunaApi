import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTableComponent {
  @Input() employees: readonly Employee[] = [];
  @Output() readonly edit = new EventEmitter<Employee>();
  @Output() readonly remove = new EventEmitter<Employee>();
}
