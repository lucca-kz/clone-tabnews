import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/errors.js";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    return pendingMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      cause: error,
      message: "Erro ao listar as migrações pendentes",
    });
    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      cause: error,
      message: "Erro ao executar as migrações pendentes",
    });
    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
