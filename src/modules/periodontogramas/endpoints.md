# Endpoints del Módulo de Periodontogramas

A continuación se detallan todos los endpoints disponibles en el archivo de rutas `periodontogramasRoutes.js` y su funcionalidad correspondiente basada en `periodontogramasController.js`.

> **Nota**: Todas las rutas listadas son relativas al prefijo del módulo (por ejemplo, `/api/periodontogramas`).

## 1. Operaciones Principales del Periodontograma

### `POST /`
- **Descripción**: Crea un nuevo periodontograma.
- **Body**: Datos principales del periodontograma (por ejemplo, `id_paciente`, `id_dentista`, notas, estado, etc.).
- **Respuesta**: `201 Created` con el resultado de la creación o el ID del nuevo periodontograma.

### `GET /:id`
- **Descripción**: Obtiene la información básica de un periodontograma por su ID.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con el objeto del periodontograma, o `404 Not Found`.

### `DELETE /:id`
- **Descripción**: Elimina un periodontograma por su ID.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con un mensaje de éxito (`{ message: 'Periodontograma eliminado' }`).

---

## 2. Consultas y Vistas Específicas

### `GET /paciente/:idPaciente`
- **Descripción**: Obtiene todos los periodontogramas asociados a un paciente específico.
- **Parámetros de ruta**: `idPaciente` (ID del paciente).
- **Respuesta**: `200 OK` con la lista de periodontogramas del paciente.

### `GET /:id/completo`
- **Descripción**: Obtiene la información consolidada y completa de un periodontograma. Incluye los datos principales, la lista de detalles de los dientes y el cálculo de estadísticas.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con el objeto completo.

### `GET /:id/estadisticas`
- **Descripción**: Obtiene únicamente las estadísticas del periodontograma (medias de Profundidad de Sondaje (PS), Nivel de Inserción (NI), porcentaje de placa y porcentaje de sangrado).
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con los datos estadísticos.

### `GET /:id/exportar`
- **Descripción**: Exporta el periodontograma en formato JSON.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con la información formateada para ser exportada.

---

## 3. Gestión de Detalles (Dientes y Registros)

### `GET /:id/detalles`
- **Descripción**: Obtiene la lista de todos los detalles (registros por diente/cara) asociados al periodontograma.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con el listado de detalles.

### `POST /:id/detalles`
- **Descripción**: Crea un nuevo registro de detalle para un diente en el periodontograma.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Body**: Datos del detalle (ej. `numero_diente`, `cara`, `sondaje_m`, placa, sangrado, etc.).
- **Respuesta**: `201 Created` con el ID del nuevo detalle (`{ id_detalle: ... }`).

### `PUT /:id/detalles/bulk`
- **Descripción**: Guarda o actualiza múltiples detalles simultáneamente (bulk save). Útil al guardar todo el gráfico del periodontograma de una sola vez.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Body**: Objeto conteniendo el arreglo de detalles a modificar:
  ```json
  {
      "detalles": [
          { "numero_diente": 18, "cara": "V", "sondaje_m": 3, /* ... otros datos */ },
          { "numero_diente": 17, "cara": "V", "sondaje_m": 2, /* ... */ }
      ]
  }
  ```
- **Respuesta**: `200 OK` con un mensaje de éxito y un arreglo de los detalles actualizados.

### `PUT /:id/detalles/:detalleId`
- **Descripción**: Actualiza la información de un detalle específico.
- **Parámetros de ruta**: `id` (ID del periodontograma), `detalleId` (ID del detalle).
- **Body**: Campos a actualizar del detalle.
- **Respuesta**: `200 OK` con mensaje ('Detalle actualizado').

---

## 4. Flujo de Trabajo

### `PATCH /:id/finalizar`
- **Descripción**: Marca un periodontograma como "finalizado" para evitar futuras modificaciones o para cambiar su estado para el seguimiento del historial.
- **Parámetros de ruta**: `id` (ID del periodontograma).
- **Respuesta**: `200 OK` con el resultado de la actualización de estado.
