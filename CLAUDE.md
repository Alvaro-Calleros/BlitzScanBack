# BlitzScan - Backend

## Descripción del Backend
API REST en Node.js + Express para el proyecto BlitzScan. Maneja toda la lógica de negocio, integración con Claude AI, generación de PDFs y acceso a base de datos. Desplegado en AWS.

## Stack
- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL en Neon
- **Autenticación:** Clerk (validación de tokens JWT en middleware)
- **IA:** Anthropic SDK (claude-3-5-sonnet)
- **Generación de PDF:** Por definir (evaluar pdfkit o puppeteer)
- **Deploy:** AWS

## Estructura de Carpetas a Construir
```text
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── routes/
│   │   └── audits.js
│   ├── services/
│   │   ├── claude/
│   │   │   ├── prompts/
│   │   │   │   ├── checklist.js
│   │   │   │   └── report.js
│   │   │   └── claude.service.js
│   │   └── pdf.service.js
│   ├── middleware/
│   │   └── auth.js
│   ├── prisma/
│   │   └── client.js
│   └── index.js
├── .env.example
└── package.json
```

## Endpoints a Implementar
- `POST /api/v1/audits` → Crear nueva auditoría
- `GET /api/v1/audits` → Listar auditorías del usuario autenticado
- `GET /api/v1/audits/:id` → Detalle de auditoría
- `POST /api/v1/audits/:id/respond` → Guardar respuesta + análisis de Claude
- `POST /api/v1/audits/:id/complete` → Finalizar, calcular score, generar PDF
- `GET /api/v1/audits/:id/report` → Descargar PDF

## Schema de Prisma
Tres modelos principales:
- **User:** `id`, `clerkId` (unique), `email`, `createdAt`
- **Audit:** `id`, `userId`, `projectName`, `projectUrl?`, `status` (IN_PROGRESS/COMPLETED/REPORT_GENERATED), `score?`, `reportUrl?`, `createdAt`, `completedAt?`
- **Response:** `id`, `auditId`, `owaspId`, `question`, `answer`, `aiAnalysis?`

## Variables de Entorno Necesarias
```bash
DATABASE_URL=        # Neon connection string
ANTHROPIC_API_KEY=   # Claude API key
CLERK_SECRET_KEY=    # Para validar tokens en middleware
PORT=3001
```

## Formato Estándar de Respuesta API
Todas las respuestas siguen este formato:
```json
{
  "success": boolean,
  "data": any,
  "error": "string | null"
}
```

## Convenciones
- Código y comentarios en español.
- Un archivo por recurso en `routes/`.
- Toda lógica de Claude reside en `services/claude/`.
- Prompts como funciones que reciben contexto y retornan string.
- Middleware de auth valida Clerk token en cada ruta protegida.

## Lo que Claude Code NO debe hacer en este repo
- **No** implementar escaneo activo de redes bajo ningún concepto.
- **No** exponer el `ANTHROPIC_API_KEY` al frontend.
- **No** hacer llamadas directas a Claude desde los routes — siempre vía `claude.service.js`.
- **No** modificar `schema.prisma` sin correr migración y documentarla.
