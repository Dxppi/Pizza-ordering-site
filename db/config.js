const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pizza_order',
    password: 'Plekhanov',
    port: 5432,
});

module.exports = pool;
