# Frontend de Gestión de Empleados

Cliente Angular standalone para el CRUD de empleados.

## Ejecución

```bash
npm install
npm start
```

La aplicación espera la API en `http://localhost:3000/api/v1/empleados`.

## Reto 4

- `AppComponent`: Smart Component; coordina el servicio y conecta observables con `async`.
- `EmployeeFormComponent`: Dumb Component; recibe el empleado por `@Input()` y emite `save`/`cancel`.
- `EmployeeTableComponent`: Dumb Component; recibe la colección por `@Input()` y emite `edit`/`remove`.
