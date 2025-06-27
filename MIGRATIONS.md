# Database Migrations & Seeding Guide

This project uses TypeORM migrations (similar to Flyway in Java) to manage database schema changes.

## Migration Workflow

### Development Mode
For development, you can use `synchronize: true` which automatically creates tables from entities:

```bash
# Use DevelopmentModule in your modules for development
npm run start:dev
```

### Production Mode
For production, use migrations to ensure database schema consistency:

```bash
# Run migrations and seed data
npm run start:setup

# Or run them separately:
npm run migration:run    # Run pending migrations
npm run start:seed       # Seed initial data
```

## Migration Commands

### Generate a new migration
```bash
# Generate migration based on entity changes
npm run migration:generate

# This will create a new file in src/database/migrations/
```

### Run migrations
```bash
# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show
```

### Revert migrations
```bash
# Revert the last migration
npm run migration:revert

# Reset database (revert all + run all + seed)
npm run db:reset
```

## Database Setup Commands

```bash
# Complete database setup (migrations + seeding)
npm run db:setup

# Reset database completely
npm run db:reset

# Run only seeding
npm run start:seed
```

## Migration Files

Migrations are stored in `src/database/migrations/` and follow the naming convention:
- `{timestamp}-{description}.ts`

Example: `1750993531750-InitSchema.ts`

## How it works (Java/Flyway comparison)

| Java/Flyway | NestJS/TypeORM |
|-------------|----------------|
| `@FlywayMigration` | `MigrationInterface` |
| `V1__Create_users.sql` | `1750993531750-InitSchema.ts` |
| `flyway migrate` | `npm run migration:run` |
| `flyway info` | `npm run migration:show` |
| `flyway clean` | `npm run migration:revert` |

## Best Practices

1. **Never use `synchronize: true` in production**
2. **Always generate migrations for schema changes**
3. **Test migrations in development before deploying**
4. **Keep migrations small and focused**
5. **Use descriptive migration names**

## Environment Configuration

The migration system uses the same environment variables as your application:
- `DB_HOST`
- `DB_PORT` 
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE` 