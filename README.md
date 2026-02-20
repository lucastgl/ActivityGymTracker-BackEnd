# Gym App — Backend

API REST construida con **NestJS**, **Prisma** y **PostgreSQL** siguiendo **Clean Architecture**.  
Gestiona rutinas de musculación, sesiones de entrenamiento, running y mediciones corporales.

> Este README es a la vez documentación del proyecto y guía didáctica para entender cómo y por qué se construyó así. Cada sección explica no solo el "qué" sino el "por qué" de las decisiones de diseño.

---

## Tabla de contenidos

1. [Tecnologías y dependencias](#1-tecnologías-y-dependencias)
2. [Variables de entorno](#2-variables-de-entorno)
3. [Comandos](#3-comandos)
4. [Arquitectura y estructura de carpetas](#4-arquitectura-y-estructura-de-carpetas)
5. [Guía de construcción paso a paso](#5-guía-de-construcción-paso-a-paso)
   - [Paso 0 — Preparación del proyecto](#paso-0--preparación-del-proyecto)
   - [Paso 1 — Estructura de carpetas](#paso-1--estructura-de-carpetas-clean-architecture)
   - [Paso 2 — Dominio](#paso-2--dominio-domain-layer)
   - [Paso 3 — Contratos de persistencia](#paso-3--contratos-de-persistencia-ports)
   - [Paso 4 — Casos de uso](#paso-4--casos-de-uso-application-layer)
   - [Paso 5 — DTOs](#paso-5--dtos)
   - [Paso 6 — Controllers HTTP](#paso-6--controllers-http-presentation-layer)
   - [Paso 7 — Infraestructura Prisma](#paso-7--infraestructura-prisma)
   - [Paso 8 — Módulos NestJS](#paso-8--módulos-nestjs-dependency-injection)
   - [Paso 9 — Errores y Swagger](#paso-9--errores-y-swagger)
6. [Endpoints disponibles](#6-endpoints-disponibles)
7. [Conceptos clave de diseño](#7-conceptos-clave-de-diseño)

---

## 1. Tecnologías y dependencias

### Runtime

| Paquete | Versión | Rol |
|---------|---------|-----|
| `@nestjs/common` + `@nestjs/core` | ^11 | Framework base |
| `@nestjs/platform-express` | ^11 | Adaptador HTTP |
| `@nestjs/config` | ^4 | Variables de entorno |
| `@nestjs/swagger` | ^11 | Documentación OpenAPI |
| `@prisma/client` | ^5.22 | ORM / cliente de BD |
| `class-validator` | ^0.14 | Validación de DTOs |
| `class-transformer` | ^0.5 | Transformación de DTOs |
| `rxjs` | ^7.8 | Observables (NestJS internals) |

### Desarrollo

| Paquete | Rol |
|---------|-----|
| `prisma` | CLI y migraciones |
| `ts-node` | Ejecutar seed y scripts TypeScript |
| `@nestjs/cli` | Scaffolding y build |
| `typescript` | Tipado estático |
| `jest` + `ts-jest` | Tests unitarios |
| `eslint` + `prettier` | Calidad y formato de código |

---

## 2. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gym_db"
```

> La base de datos debe existir antes de ejecutar las migraciones. Crear la BD con:
> ```sql
> CREATE DATABASE gym_db;
> ```

---

## 3. Comandos

### Instalación

```bash
npm install
```

### Base de datos

```bash
# Generar cliente Prisma (obligatorio después de cambios en schema.prisma)
npm run prisma:generate

# Crear y aplicar migración
npm run prisma:migrate

# Cargar datos iniciales (usuario de desarrollo por defecto)
npm run prisma:seed
```

### Desarrollo

```bash
# Modo watch (reinicia automáticamente al guardar)
npm run start:dev

# Modo debug
npm run start:debug
```

### Producción

```bash
# Compilar (genera /dist)
npm run build

# Iniciar desde dist
npm run start:prod
```

### Tests

```bash
npm run test          # unitarios
npm run test:cov      # con cobertura
npm run test:e2e      # end-to-end
```

### Calidad de código

```bash
npm run lint    # ESLint + auto-fix
npm run format  # Prettier
```

### Documentación Swagger

Con la app corriendo, acceder a:

```
http://localhost:3000/api/docs
```

---

## 4. Arquitectura y estructura de carpetas

El proyecto sigue **Clean Architecture**, separando el código en capas con reglas de dependencia estrictas:

```
src/
├── domain/               # Núcleo: entidades, VOs, enums, interfaces de repos
│   ├── entities/         # Exercise, Routine, WorkoutSession, RunSession, etc.
│   ├── enums/            # MuscleCategory, Equipment, SessionStatus, etc.
│   ├── repositories/     # Interfaces (contratos) de persistencia
│   ├── services/         # Servicios de dominio puros (splits, scoring)
│   └── value-objects/    # Id, DateOnly
│
├── aplication/           # Casos de uso y DTOs
│   ├── use-cases/        # Por feature: exercises/, routines/, workouts/, etc.
│   ├── dtos/             # DTOs de request y response por feature
│   ├── ports/            # Puertos: CalendarQueryRepository, ReportsQueryRepository
│   └── adapters/         # Stubs para desarrollo sin infraestructura
│
├── infrastructure/       # Implementaciones concretas de los contratos
│   ├── db/               # PrismaService, PrismaModule
│   ├── repositories/     # PrismaExerciseRepository, etc.
│   └── mappers/          # Conversión Prisma ↔ Domain
│
├── presentation/         # Capa HTTP
│   └── http/
│       └── controllers/  # ExercisesController, RoutinesController, etc.
│
└── shared/               # Código transversal
    ├── errors/           # DomainError, NotFoundError, ConflictError, etc.
    └── filters/          # HttpExceptionFilter
```

### Regla de dependencia

```
presentation → aplication → domain
infrastructure → domain (implementa sus contratos)
shared → nadie (puede ser importado por cualquier capa)
```

**Lo que esta regla garantiza:**
- El dominio no sabe que existe NestJS, Prisma ni HTTP.
- Los casos de uso no saben si el repositorio usa Prisma, MongoDB o un stub en memoria.
- Los controllers no contienen lógica de negocio.

---

## 5. Guía de construcción paso a paso

Esta sección explica cómo se construyó el proyecto y **por qué en ese orden**.  
Seguirla te permite entender la estructura y reproducirla desde cero.

---

### Paso 0 — Preparación del proyecto

**Qué se hizo:**

```bash
nest new back-app-gym
npm install class-validator class-transformer @nestjs/config
```

**Por qué primero:**  
Configurar validación (`class-validator`) y variables de entorno (`@nestjs/config`) desde el inicio garantiza que todo lo que se construya encima ya tenga estas bases. El `ValidationPipe` global se configura en `main.ts`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // descarta propiedades no declaradas en el DTO
  forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
  transform: true,           // convierte el payload a instancia del DTO
  transformOptions: { enableImplicitConversion: true }, // string → number automático
}));
```

**Qué NO hacer todavía:** Prisma, controllers, base de datos. Sin saber el dominio, cualquier cosa que armes va a cambiar.

---

### Paso 1 — Estructura de carpetas (Clean Architecture)

**Qué se hizo:** Crear el esqueleto de carpetas vacías antes de escribir una sola línea de lógica.

**Por qué:**  
Si arrancás con controllers o con Prisma antes de definir la estructura, inevitablemente mezclás capas. Después es muy difícil separar "qué es dominio" de "qué es infraestructura".

**Regla mental para cada capa:**

| Capa | Regla |
|------|-------|
| `domain/` | No importa NADA de Nest, Prisma ni HTTP |
| `aplication/` | No sabe que existe HTTP ni bases de datos |
| `infrastructure/` | Implementa contratos del dominio |
| `presentation/` | Solo adapta HTTP → casos de uso |
| `shared/` | Código transversal sin dependencias de negocio |

---

### Paso 2 — Dominio (Domain Layer)

Esta es la capa más importante y la más estable. Cambiarla implica cambiar todo lo demás.

#### 2.1 Enums

Primero los enums porque las entidades dependen de ellos:

```typescript
// src/domain/enums/muscle-category.enum.ts
export enum MuscleCategory {
  ARM = 'ARM',
  SHOULDER = 'SHOULDER',
  CHEST = 'CHEST',
  LEG = 'LEG',
  BACK = 'BACK',
}
```

Enums creados: `MuscleCategory`, `Equipment`, `SideType`, `SessionStatus`, `SetType`, `OriginType`.

#### 2.2 Value Objects

```typescript
// src/domain/value-objects/date-only.vo.ts
export class DateOnly {
  private constructor(private readonly value: string) {}

  static fromString(s: string): DateOnly { /* valida formato YYYY-MM-DD */ }
  toString(): string { return this.value; }
}
```

**Por qué `DateOnly`:** La fecha es el identificador principal de sesiones (workout y run). Usar `string` desnudo genera bugs de timezone. `DateOnly` encapsula la validación del formato y hace explícito que es una fecha sin hora.

```typescript
// src/domain/value-objects/id.vo.ts
export class Id {
  static fromString(s: string): Id { /* valida UUID */ }
  get value(): string { return this.id; }
}
```

#### 2.3 Entidades

Orden de creación (por dependencia):

1. `Exercise` — no depende de otras entidades
2. `Routine`, `RoutineDay`, `RoutineDayExercise` — RoutineDayExercise referencia Exercise
3. `WorkoutSession`, `WorkoutExercise`, `WorkoutSet`, `WorkoutDrop` — WorkoutExercise referencia Exercise
4. `RunSession`, `RunSplit` — independiente
5. `BodyMeasurement` — independiente

Las entidades son clases simples con propiedades. No tienen decorators de Nest ni imports de Prisma:

```typescript
// src/domain/entities/exercise.entity.ts
export class Exercise {
  constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly name: string,
    public readonly category: MuscleCategory,
    public readonly equipment: Equipment,
    public readonly sideType: SideType,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
```

#### 2.4 Servicios de dominio

Lógica de negocio pura que no necesita persistencia:

- **`RunningSplitsService`** — genera parciales (splits) de 1km a partir de distancia total y duración.
- **`WorkoutScoringService`** — helpers para calcular PR, mejor set, score de sesión.

Estos servicios son testeables sin BD porque no tienen imports de infraestructura.

---

### Paso 3 — Contratos de persistencia (Ports)

**Qué se hizo:** Definir interfaces TypeScript que describen qué operaciones necesita la aplicación, sin decir cómo se implementan.

```typescript
// src/domain/repositories/exercise.repository.ts
export interface ExerciseRepository {
  create(userId: Id, exercise: CreateExerciseInput): Promise<Exercise>;
  update(userId: Id, exerciseId: Id, patch: UpdateExercisePatch): Promise<Exercise | null>;
  findById(userId: Id, id: Id): Promise<Exercise | null>;
  list(userId: Id, filters?: ExerciseListFilters): Promise<Exercise[]>;
  setActive(userId: Id, id: Id, isActive: boolean): Promise<Exercise | null>;
}
```

**Por qué antes de los casos de uso:**  
Los casos de uso dependen de estas interfaces. Si los escribís antes, terminás inventando métodos sobre la marcha, sin criterio. Definir primero las interfaces te obliga a pensar: "¿Qué operaciones necesita la app?".

**Criterio para diseñar los métodos:**  
Pensalos por necesidad de la aplicación, no por tablas:

| ❌ Pensando en tablas | ✅ Pensando en necesidades |
|----------------------|--------------------------|
| `findAll()` | `list(userId, filters)` |
| `findByPk(id)` | `findByUserAndDate(userId, date)` |
| `update(data)` | `upsertByDate(userId, date, payload)` |

Repositorios creados: `ExerciseRepository`, `RoutineRepository`, `WorkoutRepository`, `RunRepository`, `MeasurementRepository`.

---

### Paso 4 — Casos de uso (Application Layer)

Los casos de uso son el corazón de la aplicación. Expresan qué puede hacer el sistema.

**Estructura de un caso de uso:**

```typescript
// src/aplication/use-cases/exercises/create-exercise.use-case.ts
@Injectable()
export class CreateExerciseUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly repo: ExerciseRepository, // interfaz, no Prisma
  ) {}

  async execute(userId: Id, input: CreateExerciseInput): Promise<Exercise> {
    // Solo lógica de negocio: validar, delegar al repo, devolver
    return this.repo.create(userId, input);
  }
}
```

**Token de inyección:** Cada feature tiene su token:

```typescript
// src/aplication/use-cases/exercises/exercise-repository.token.ts
export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');
```

Esto permite cambiar la implementación (Prisma → stub → MongoDB) sin tocar el caso de uso.

**Orden de implementación (por dependencia funcional):**

| Bloque | Feature | Razón de prioridad |
|--------|---------|-------------------|
| A | Ejercicios | Base de todo: rutinas y sesiones los referencian |
| B | Rutinas | "Activar rutina" depende del catálogo |
| C | Musculación | Si no existe sesión, no hay qué activar |
| D | Running | Independiente pero necesario para calendario |
| E | Mediciones | Informes dependen de la última medición |
| F | Calendario | Agrega workout + run por fecha |
| G | Reportes | El más caro: depende de todo lo anterior |

---

### Paso 5 — DTOs

Los DTOs formalizan el contrato entre HTTP y los casos de uso.

**Por qué después de los casos de uso:**  
Primero definís "qué necesita el caso de uso". Después formalizás los DTOs. Al revés, inventás campos innecesarios.

**Un DTO de request con validación y Swagger:**

```typescript
// src/aplication/dtos/exercises/create-exercise.dto.ts
export class CreateExerciseDto {
  @ApiProperty({ example: 'Curl de bíceps' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: MuscleCategory })
  @IsEnum(MuscleCategory)
  category!: MuscleCategory;
}
```

**Qué incluyen los DTOs:**
- Validaciones con `class-validator` (`@IsString`, `@IsEnum`, etc.)
- Transformaciones con `class-transformer` (`@Transform`, `@Type`)
- Documentación con `@ApiProperty` de `@nestjs/swagger`

**Qué NO incluyen:**
- Entidades de dominio
- Modelos Prisma
- Lógica de negocio

---

### Paso 6 — Controllers HTTP (Presentation Layer)

Los controllers son adaptadores: convierten HTTP en llamadas a casos de uso.

**Patrón de un controller (regla de oro):**

```typescript
@ApiTags('Exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly createExercise: CreateExerciseUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear ejercicio' })
  @ApiResponse({ status: 201, type: ExerciseResponseDto })
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
    const exercise = await this.createExercise.execute(userId, dto);
    return this.toResponseDto(exercise); // entidad → DTO de respuesta
  }
}
```

**El controller NUNCA:**
- Arma queries SQL
- Calcula lógica de negocio
- Accede directamente al repo

**Por qué controllers después:**  
Dependen de DTOs y casos de uso. Construirlos antes mezcla validación, lógica y persistencia en un solo lugar.

---

### Paso 7 — Infraestructura Prisma

Recién en este paso se conecta la base de datos.

**Por qué Prisma tan tarde:**  
A esta altura ya sabés exactamente:
- Qué entidades necesitás
- Qué operaciones necesitás (métodos de los repositorios)
- Qué relaciones existen entre entidades

Sin eso, el schema de Prisma cambia constantemente.

#### 7.1 Schema Prisma

```prisma
// prisma/schema.prisma
model Exercise {
  id        String         @id @default(uuid())
  userId    String
  name      String
  category  MuscleCategory
  equipment Equipment
  sideType  SideType
  isActive  Boolean        @default(true)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, isActive, category])
}
```

Decisiones importantes en el schema:
- `date` se guarda como `String` (formato `YYYY-MM-DD`) para evitar problemas de timezone
- `@@unique([userId, date])` en `WorkoutSession` y `RunSession` para garantizar una sesión por usuario por día
- `onDelete: Cascade` donde tiene sentido (borrar Routine → borra RoutineDays)

#### 7.2 Mappers

Los mappers convierten entre el mundo de Prisma y el mundo del dominio:

```typescript
// src/infrastructure/mappers/exercise.mapper.ts
export const ExerciseMapper = {
  toDomain(row: PrismaExerciseRow): Exercise {
    return new Exercise(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      row.name,
      row.category as MuscleCategory,
      // ...
    );
  },

  toPrismaCreate(userId: Id, input: CreateExerciseInput): PrismaExerciseCreateData {
    return {
      user: { connect: { id: userId.value } },
      name: input.name,
      // ...
    };
  },
};
```

**Por qué mappers:**  
Evitan que los tipos de Prisma (ORM) se filtren hacia la capa de aplicación. Si algún día cambias de Prisma a otro ORM, solo tocas los mappers.

> **Nota técnica:** Se usan interfaces locales en lugar de los tipos exportados por `@prisma/client` para evitar problemas de resolución de tipos con `moduleResolution: "nodenext"`.

#### 7.3 Repositorios concretos

```typescript
// src/infrastructure/repositories/prisma-exercise.repository.ts
@Injectable()
export class PrismaExerciseRepository implements ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: Id, exercise: CreateExerciseInput): Promise<Exercise> {
    const created = await this.prisma.exercise.create({
      data: ExerciseMapper.toPrismaCreate(userId, exercise),
    });
    return ExerciseMapper.toDomain(created);
  }
  // ...
}
```

---

### Paso 8 — Módulos NestJS (Dependency Injection)

Cada feature tiene su propio módulo autónomo que agrupa todo lo que necesita:

```typescript
// src/aplication/use-cases/exercises/exercises.module.ts
@Module({
  imports: [PrismaModule],
  providers: [
    CreateExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeactivateExerciseUseCase,
    RestoreExerciseUseCase,
    { provide: EXERCISE_REPOSITORY, useClass: PrismaExerciseRepository },
    //          ↑ token de la interfaz    ↑ implementación concreta
  ],
  controllers: [ExercisesController],
  exports: [/* use cases que otros módulos necesiten */],
})
export class ExercisesModule {}
```

**Por qué módulos por feature y no un AppModule gigante:**

| AppModule gigante | Feature modules |
|-------------------|----------------|
| Difícil de leer y mantener | Cohesión: todo lo del feature junto |
| Cualquier cambio afecta todo | Encapsulado: cambios localizados |
| Imposible testear en aislamiento | Testeable: se puede mockear el módulo |
| Dependencias implícitas | Dependencias explícitas en `imports` |

**El `HttpModule` solo importa los feature modules; no declara controllers:**

```typescript
@Module({
  imports: [
    ExercisesModule, RoutinesModule, WorkoutsModule,
    RunsModule, MeasurementsModule, CalendarModule, ReportsModule,
  ],
})
export class HttpModule {}
```

---

### Paso 9 — Errores y Swagger

#### 9.1 Error handling

Las clases de error viven en `src/shared/errors/`:

```
DomainError (base)
├── NotFoundError  → HTTP 404
├── ConflictError  → HTTP 409
└── ValidationError → HTTP 422
```

**Uso en casos de uso o repositorios:**

```typescript
import { NotFoundError } from '../../../../shared/errors';

const routine = await this.repo.findById(userId, routineId);
if (!routine) throw new NotFoundError('Rutina', routineId.value);
```

**`HttpExceptionFilter`** intercepta cualquier excepción y devuelve JSON consistente:

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Rutina con id \"abc\" no encontrada",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/routines/abc"
}
```

Se registra globalmente en `main.ts`:
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
```

**Por qué al final:**  
Hasta este punto ya existen endpoints reales. Estandarizar las respuestas de error sobre algo que ya existe es más preciso que hacerlo "en el vacío".

#### 9.2 Swagger

Configurado en `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Gym App API')
  .setDescription('API para gestión de rutinas, entrenamientos, running y mediciones')
  .setVersion('1.0')
  .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'x-user-id')
  .build();

SwaggerModule.setup('api/docs', app, document);
```

Los DTOs tienen `@ApiProperty` y los controllers tienen `@ApiTags` / `@ApiOperation` / `@ApiResponse`.

---

## 6. Endpoints disponibles

### Exercises `GET /exercises`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/exercises` | Listar con filtros |
| `POST` | `/exercises` | Crear |
| `PATCH` | `/exercises/:id` | Actualizar |
| `POST` | `/exercises/:id/deactivate` | Soft-delete |
| `POST` | `/exercises/:id/restore` | Restaurar |

### Routines `GET /routines`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/routines` | Listar rutinas |
| `POST` | `/routines` | Crear rutina |
| `GET` | `/routines/:id` | Detalle con días y ejercicios |
| `PATCH` | `/routines/:id` | Actualizar |
| `POST` | `/routines/:id/days` | Agregar día |
| `PATCH` | `/routines/:id/days/:dayId` | Actualizar día |
| `POST` | `/routines/:id/days/:dayId/exercises` | Agregar ejercicio al día |
| `PATCH` | `/routines/:id/days/:dayId/exercises/:exId` | Actualizar ejercicio planeado |
| `POST` | `/routines/:id/activate` | Activar para fecha (crea sesión de workout) |

### Workouts `GET /workouts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/workouts/:date` | Sesión por fecha |
| `PUT` | `/workouts/:date` | Crear/actualizar sesión |
| `POST` | `/workouts/:date/exercises` | Agregar ejercicio |
| `DELETE` | `/workouts/:date/exercises/:exId` | Quitar ejercicio |
| `PUT` | `/workouts/:date/exercises/:exId/sets` | Crear/actualizar set |
| `PUT` | `/workouts/:date/exercises/:exId/sets/:setId/drops` | Reemplazar drops |
| `POST` | `/workouts/:date/complete` | Marcar completado |
| `POST` | `/workouts/:date/revert` | Volver a borrador |

### Runs `GET /runs`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/runs/:date` | Sesión de run por fecha |
| `PUT` | `/runs/:date` | Crear/actualizar sesión |
| `POST` | `/runs/splits/generate` | Generar splits sugeridos (sin persistir) |
| `PUT` | `/runs/:date/splits` | Reemplazar splits |
| `POST` | `/runs/:date/complete` | Marcar completado |
| `POST` | `/runs/:date/revert` | Volver a borrador |

### Measurements `GET /measurements`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/measurements` | Registrar medición |
| `GET` | `/measurements/latest` | Última medición |
| `GET` | `/measurements` | Listar por rango de fechas |

### Calendar y Reports

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/calendar` | Resumen mensual |
| `GET` | `/calendar/:date` | Detalle de un día |
| `GET` | `/reports` | Informes por rango y filtros |

---

## 7. Conceptos clave de diseño

### Autenticación provisional

Todos los endpoints leen el `userId` del header `x-user-id`. Si no está presente, se usa el usuario de desarrollo por defecto (`00000000-0000-4000-8000-000000000000`). Reemplazar por JWT en producción.

### Sesiones por fecha

`WorkoutSession` y `RunSession` tienen restricción única `(userId, date)`. Esto significa que un usuario solo puede tener un workout y un run por día. La fecha se guarda como string `YYYY-MM-DD` para evitar conversiones de timezone.

### Soft-delete en Exercise

Los ejercicios no se borran físicamente. Se desactivan con `isActive = false`. Esto permite mantener la integridad referencial en rutinas y sesiones históricas.

### Tokens de inyección

En lugar de inyectar implementaciones concretas, se usan `Symbol` como tokens:

```typescript
// Definición
export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

// En el módulo
{ provide: EXERCISE_REPOSITORY, useClass: PrismaExerciseRepository }

// En el caso de uso
@Inject(EXERCISE_REPOSITORY) private readonly repo: ExerciseRepository
```

Esto permite intercambiar `PrismaExerciseRepository` por un stub en tests sin cambiar el caso de uso.

### Respuesta de error consistente

Cualquier excepción del dominio o de NestJS se transforma al mismo formato:

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Ejercicio con id \"abc\" no encontrado",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/exercises/abc"
}
```

---

## Licencia

Uso privado.
