# Prisma e Infraestructura - Explicación

## Resumen de lo creado

Se implementó la capa de persistencia con Prisma siguiendo Clean Architecture. El dominio no conoce la base de datos; la infraestructura adapta los modelos de Prisma a las entidades de dominio.

---

## 1. Prisma Schema (`prisma/schema.prisma`)

### Qué es
El schema define el modelo de datos de PostgreSQL: tablas, relaciones, enums, índices y constraints.

### Tablas creadas (alineadas con el dominio)

| Tabla | Entidad dominio | Relaciones |
|-------|-----------------|------------|
| `User` | User | Raíz para multi-tenant |
| `Exercise` | Exercise | userId → User |
| `Routine` | Routine | userId → User |
| `RoutineDay` | RoutineDay | routineId → Routine |
| `RoutineDayExercise` | RoutineDayExercise | routineDayId, exerciseId |
| `WorkoutSession` | WorkoutSession | userId → User, **@@unique([userId, date])** |
| `WorkoutExercise` | WorkoutExercise | workoutSessionId, exerciseId |
| `WorkoutSet` | WorkoutSet | workoutExerciseId |
| `WorkoutDrop` | WorkoutDrop | workoutSetId |
| `RunSession` | RunSession | userId → User, **@@unique([userId, date])** |
| `RunSplit` | RunSplit | runSessionId |
| `BodyMeasurement` | BodyMeasurement | userId → User |

### Constraints e índices

- **@@unique([userId, date])** en `WorkoutSession` y `RunSession`: un usuario solo puede tener una sesión por fecha.
- **@@index([userId])** en tablas con userId para consultas por usuario.
- **@@index([userId, isActive, category])** en Exercise para listados filtrados.
- **onDelete: Cascade** en relaciones hijas (ej: borrar Routine → borrar RoutineDay).
- **onDelete: Restrict** en Exercise cuando se referencia desde rutinas/workouts (evitar borrar ejercicios en uso).

### Por qué
El schema refleja el dominio para mantener coherencia. Los constraints evitan datos inválidos a nivel de BD.

---

## 2. Mappers (`infrastructure/mappers/`)

### Qué son
Funciones que convierten entre:
- **Prisma (modelo de persistencia)** ↔ **Domain (entidades de negocio)**

### Responsabilidades

- **toDomain(prismaRow)**: fila de Prisma → entidad de dominio (Id, DateOnly, enums).
- **toPrismaCreate / toPrismaUpdate**: input de dominio → datos para `prisma.*.create()` o `update()`.

### Ejemplo

```ts
// exercise.mapper.ts
ExerciseMapper.toDomain(row)        // Prisma Exercise → Domain Exercise
ExerciseMapper.toPrismaCreate(userId, input)  // CreateExerciseInput → Prisma.ExerciseCreateInput
```

### Por qué
El dominio usa `Id`, `DateOnly`, entidades con constructores. Prisma usa strings, Date, objetos planos. Los mappers aíslan esas diferencias en un solo lugar.

---

## 3. Repositorios concretos (`infrastructure/repositories/`)

### Qué son
Implementaciones de las interfaces definidas en `domain/repositories/`:

| Repositorio | Implementa | Persistencia |
|-------------|------------|--------------|
| `PrismaExerciseRepository` | ExerciseRepository | prisma.exercise |
| `PrismaRoutineRepository` | RoutineRepository | prisma.routine, routineDay, routineDayExercise |
| `PrismaWorkoutRepository` | WorkoutRepository | prisma.workoutSession, workoutExercise, workoutSet, workoutDrop |
| `PrismaRunRepository` | RunRepository | prisma.runSession, runSplit |
| `PrismaMeasurementRepository` | MeasurementRepository | prisma.bodyMeasurement |

### Flujo típico

1. Recibir parámetros de dominio (Id, DateOnly, etc.).
2. Ejecutar operaciones con Prisma (create, findMany, update, etc.).
3. Usar mappers para convertir resultados a entidades de dominio.
4. Devolver entidades al use case.

### Por qué
Los use cases dependen de interfaces (puertos), no de Prisma. Si mañana cambias a TypeORM o MongoDB, solo cambias los repositorios; el dominio y la aplicación no se tocan.

---

## 4. InfrastructureModule

### Qué hace
- Importa `PrismaModule` (PrismaService).
- Proporciona las implementaciones concretas de los repositorios.
- Registra los tokens (`EXERCISE_REPOSITORY`, etc.) con `useClass: Prisma*Repository`.

### Integración
Los módulos de use cases (`ExercisesModule`, `RoutinesModule`, etc.) importan `InfrastructureModule` y dejan de usar stubs. Obtienen los repositorios por inyección.

---

## 5. Cómo funciona el flujo completo

```
HTTP Request
    → Controller (valida DTO)
    → UseCase.execute(userId, ...)
    → ExerciseRepository (interfaz)
    → PrismaExerciseRepository (implementación)
    → PrismaService (PrismaClient)
    → PostgreSQL
    → Mapper.toDomain(row)
    → Exercise (entidad)
    → Controller (serializa a DTO)
    → HTTP Response
```

El dominio solo ve interfaces y entidades. La infraestructura se encarga de Prisma y la base de datos.

---

## 6. Escalabilidad y Clean Architecture

### Inversión de dependencias
- **Domain** define interfaces (ExerciseRepository).
- **Application** usa esas interfaces en use cases.
- **Infrastructure** implementa las interfaces.

Las dependencias apuntan hacia el dominio; la infraestructura es un detalle intercambiable.

### Cambio de persistencia
Para cambiar de Prisma a otra tecnología:
1. Crear nuevos repositorios (ej: `MongoExerciseRepository`).
2. Cambiar el provider en `InfrastructureModule`.
3. El resto del código (dominio, aplicación, presentación) no cambia.

### Testing
- Use cases se pueden probar con mocks/stubs de los repositorios.
- Los repositorios se pueden probar con una BD de test o con Prisma mocking.

### Multi-tenant
El `userId` en todas las consultas asegura aislamiento por usuario. Los índices por `userId` mejoran el rendimiento de las consultas por usuario.

---

## 7. Comandos útiles

```bash
# Generar cliente Prisma
npm run prisma:generate

# Crear migración y aplicarla
npm run prisma:migrate

# Ejecutar seed (crear usuario por defecto)
npx prisma db seed

# Compilar (incluye prisma generate)
npm run build
```

---

## 8. Requisitos

- PostgreSQL en ejecución.
- `DATABASE_URL` en `.env` (ver `.env.example`).
- Ejecutar `prisma migrate dev` antes de usar la app.
- Ejecutar `prisma db seed` para crear el usuario por defecto (`00000000-0000-4000-8000-000000000000`).
