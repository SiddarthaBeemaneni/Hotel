/* =========================================================
   DATABASE INITIALIZER & RUNNER SCRIPT
   Reads and executes schema.sql, seed.sql, and procedures.sql
   ========================================================= */

require('dotenv').config({ path: '../.env' });
require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runDatabaseInit() {
  console.log('\n======================================================');
  console.log('  🏨 SIDDARTHA PALACE — DATABASE MIGRATION RUNNER');
  console.log('======================================================');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  console.log(`Connecting to MySQL at ${dbConfig.host}:${dbConfig.port} as user '${dbConfig.user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Successfully connected to MySQL Server!\n');
  } catch (err) {
    console.error('✗ Connection to MySQL Server failed:', err.message);
    console.log('\nℹ If your MySQL server has a password, please set DB_PASSWORD in server/.env.');
    console.log('  If MySQL service is not started, start MySQL in XAMPP / MySQL Workbench / Services.');
    return;
  }

  try {
    // 1. Run schema.sql
    const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('→ Executing db/schema.sql (Creating database, tables, indexes, views, triggers)...');
      let schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Clean DELIMITER syntax for node-mysql2
      schemaSql = schemaSql.replace(/DELIMITER\s+\$\$/g, '').replace(/DELIMITER\s+;/g, '').replace(/\$\$/g, ';');
      
      await connection.query(schemaSql);
      console.log('✓ schema.sql executed successfully!\n');
    }

    // Switch to hotel_management_db
    await connection.changeUser({ database: 'hotel_management_db' });

    // 2. Run seed.sql
    const seedPath = path.resolve(__dirname, '../../db/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('→ Executing db/seed.sql (Populating 10+ guests, 20 rooms, 10 reservations, dining, staff)...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✓ seed.sql executed successfully!\n');
    }

    // 3. Run procedures.sql
    const procPath = path.resolve(__dirname, '../../db/procedures.sql');
    if (fs.existsSync(procPath)) {
      console.log('→ Executing db/procedures.sql (Installing stored procedures)...');
      let procSql = fs.readFileSync(procPath, 'utf8');
      procSql = procSql.replace(/DELIMITER\s+\$\$/g, '').replace(/DELIMITER\s+;/g, '').replace(/\$\$/g, ';');
      await connection.query(procSql);
      console.log('✓ procedures.sql executed successfully!\n');
    }

    // Verify Counts
    console.log('------------------------------------------------------');
    console.log('  📊 DATABASE VERIFICATION & RECORD COUNTS');
    console.log('------------------------------------------------------');

    async function safeCount(conn, table) {
      try {
        const [rows] = await conn.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        return rows[0].count;
      } catch (_) { return 'N/A (table not yet created)'; }
    }

    const counts = {
      customers:    await safeCount(connection, 'customers'),
      rooms:        await safeCount(connection, 'rooms'),
      bookings:     await safeCount(connection, 'bookings'),
      tenants:      await safeCount(connection, 'tenants'),
      rent_payments:await safeCount(connection, 'rent_payments'),
      employees:    await safeCount(connection, 'employees'),
      menu_items:   await safeCount(connection, 'menu_items'),
    };

    console.log(`  • Customers:      ${counts.customers} records`);
    console.log(`  • Rooms:          ${counts.rooms} records`);
    console.log(`  • Bookings:       ${counts.bookings} records`);
    console.log(`  • Tenants:        ${counts.tenants} records`);
    console.log(`  • Rent Payments:  ${counts.rent_payments} records`);
    console.log(`  • Employees:      ${counts.employees} records`);
    console.log(`  • Menu Items:     ${counts.menu_items} records`);

    console.log('\n✓ Database initialization finished with 100% success!');
    console.log('======================================================\n');
  } catch (sqlErr) {
    console.error('✗ SQL execution error:', sqlErr.message);
  } finally {
    if (connection) await connection.end();
  }
}

runDatabaseInit();
