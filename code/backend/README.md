# Practica 3: pruebas del backend

## Objetivo

La practica evalua dos aspectos del backend:

- **Mantenibilidad y modularidad (Jest):** comprobar que el controlador de empleados trabaja a traves de la interfaz `IEmployeeRepository`. La prueba usa un repositorio simulado, no importa Mongoose y no necesita levantar el servidor ni conectarse a la base de datos.
- **Rendimiento y validacion perimetral (Artillery):** enviar solicitudes HTTP al backend local para medir sus tiempos de respuesta y comprobar que Zod acepta datos validos y rechaza datos invalidos antes de ejecutar la operacion del repositorio.

## Ejecucion

Desde la carpeta `backend`, ejecutar `npm test -- --runInBand` para la prueba unitaria. Para Artillery, iniciar el backend en una terminal con `npm run dev` y, en otra terminal, ejecutar `npm run test:stress`.

Artillery apunta a `http://localhost:3000` y usa `POST /api/v1/empleados`. Cada usuario virtual envia un empleado valido, que debe responder `201`, y despues un empleado con sueldo negativo, que debe ser rechazado con `400`.

## Resultado de Jest

La prueba unitaria del controlador paso. Se comprobo que `getEmpleado` consulta una vez `findAll` en el repositorio simulado y responde con estado `200` y la lista recibida. Esta prueba verifica la independencia del controlador respecto a Mongoose.

## Resultado de Artillery

| Medicion | Resultado | Evaluacion |
|---|---:|---|
| Usuarios virtuales completados | 1.075 de 1.075 | Correcto |
| Solicitudes HTTP | 2.150 | Correcto |
| Respuestas `201` | 1.075 | Correcto: creaciones validas |
| Respuestas `400` | 1.075 | Correcto: Zod rechazo los datos invalidos |
| Expectativas de estado aprobadas | 2.150 | Correcto |
| Usuarios virtuales fallidos | 0 | Correcto |
| Tasa maxima de errores | Menor que 1 % | Umbral aprobado |
| p99 general de respuesta | 186,8 ms | Umbral de 200 ms aprobado |
| p99 para respuestas `2xx` | 214,9 ms | Sobre 200 ms |
| p99 para respuestas `4xx` | 2 ms | Rechazo rapido |

La ejecucion duro aproximadamente 52 segundos. El promedio general fue 82,7 ms, la mediana 4 ms y el p95 general 165,7 ms.

## Interpretacion

La prueba funcional de carga paso: las solicitudes validas se crearon, las invalidas recibieron el `400` esperado y no hubo escenarios fallidos. El p99 general tambien cumplio el umbral configurado de 200 ms.

El p99 general combina respuestas `2xx` y `4xx`. Como Zod rechaza los datos invalidos en aproximadamente 0 a 4 ms, esas respuestas rapidas reducen la estadistica combinada. Por eso, el p99 de las respuestas exitosas `2xx` fue 214,9 ms y supero 200 ms. Si el requisito exige que las creaciones validas cumplan individualmente el limite de 200 ms, ese resultado no lo cumple, aunque el p99 global haya pasado.

## Consideracion sobre los datos

Aunque Artillery y Express se ejecutan localmente, el backend esta configurado para conectarse a MongoDB Atlas. Cada respuesta `201` corresponde a un empleado creado en la base conectada; esta ejecucion pudo agregar aproximadamente 1.075 registros. Las solicitudes rechazadas con `400` no deben crear empleados.
