## Prisma User Guide

This guide covers the integration of Prisma in our monorepo setup, allowing our services to interface with the database through a centralized ORM.

### Directory Structure

Within the root of our repository, the `prisma` directory contains:

- `schema.prisma`: The main configuration file where we define our database connection and data models.
- `migrations`: (Generated once you use Prisma Migrate) Contains migration files representing changes to our database schema over time.

### Setting Up Prisma

1. **Generate Prisma Client**:
   Navigate to the root directory and run:
   ```bash
   npx prisma generate
   ```
   This command creates a Prisma Client based on your models, which allows for type-safe database queries.

### Migrations (Optional)

If you want to use Prisma Migrate to handle database migrations:

1. **Creating a New Migration**:

   ```bash
   npx prisma migrate dev --name name_of_migration
   ```

   This command will generate migration files within the `prisma/migrations` directory. It also applies the migration, updating the database schema.

2. **Apply Migrations**:
   ```bash
   npx prisma migrate deploy
   ```
   Use this command to apply migrations on production or other environments.

### Using Prisma in Services

1. **Importing Prisma Client**:
   In your service code (e.g., `user-service`, `matching-service`), you can import the Prisma Client like so:

   ```javascript
   const { PrismaClient } = require("@prisma/client");
   const prisma = new PrismaClient();
   ```

2. **Database Queries**:
   Utilize Prisma Client for type-safe queries:
   ```javascript
   const users = await prisma.user.findMany();
   ```

### Considerations

- **Frontend Usage**: It's not recommended to use Prisma directly on the frontend. Instead, create API endpoints in your backend services for frontend access. Let the services manage direct database interactions using Prisma.
- **Model Updates**: Whenever you modify the models in `schema.prisma`, always remember to regenerate the Prisma Client by running `npx prisma generate` to reflect those changes.
