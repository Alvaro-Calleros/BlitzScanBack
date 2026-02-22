# BlitzScan - Gestión de Base de Datos (Prisma)

## Base de Datos
PostgreSQL alojado en Neon. Conexión vía variable de entorno `DATABASE_URL`.
**ORM:** Prisma.

## Schema Actual
El esquema se compone de tres modelos principales:

### User
- `id`: `cuid`, primary key.
- `clerkId`: `string`, único — es el identificador que viene de Clerk.
- `email`: `string`, único.
- `createdAt`: `DateTime`.

### Audit
- `id`: `cuid`, primary key.
- `userId`: foreign key → `User`.
- `projectName`: `string`.
- `projectUrl`: `string`, opcional.
- `status`: enum (`IN_PROGRESS`, `COMPLETED`, `REPORT_GENERATED`).
- `score`: `int`, opcional (0-100, se calcula al completar).
- `reportUrl`: `string`, opcional (URL del PDF generado).
- `createdAt`: `DateTime`.
- `completedAt`: `DateTime`, opcional.
- **Relación:** `responses[]`.

### Response
- `id`: `cuid`, primary key.
- `auditId`: foreign key → `Audit`.
- `owaspId`: `string` (ej: "A01", "A02", hasta "A10").
- `question`: `string` (pregunta generada por Claude).
- `answer`: `string` (respuesta del usuario).
- `aiAnalysis`: `string`, opcional (análisis de Claude).
- **Índice:** En `auditId` para queries rápidas.

## Reglas para Migraciones
- **Nunca** modificar el schema sin crear una migración: `npx prisma migrate dev --name descripcion`.
- **Nombrar** migraciones en español descriptivo: `"agregar-campo-score-a-audit"`.
- **Generar cliente:** Después de cada migración correr: `npx prisma generate`.
- **Producción:** No usar `prisma db push` en producción — solo `migrate deploy`.

## Cliente de Prisma
- **Instancia única:** Definida en `src/prisma/client.js`.
- **Uso:** Importar desde ahí en todos los servicios.
- **Prohibición:** No instanciar `PrismaClient` en múltiples archivos.

## Lo que Claude Code NO debe hacer aquí
- **No** eliminar modelos o campos sin instrucción explícita.
- **No** usar `cascade delete` sin confirmación.
- **No** crear índices sin justificar el motivo técnico.
- **No** cambiar tipos de datos en campos existentes sin una migración debidamente documentada.
