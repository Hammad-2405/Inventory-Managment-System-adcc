const express = require('express');
//const { Client } = require('pg');
const path = require('path');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const port = 3000;
const { Pool, Client } = require('pg');
const multer = require('multer');
const upload = multer();
const crypto = require('crypto');

function encryptCNIC(cnic) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from('123789456987654321'), Buffer.from('1111111111156459'));
  let encrypted = cipher.update(cnic, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

app.use(session({
  secret: '123789456987654321',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    maxAge: 240000 // Session expiration time in milliseconds
  }
}));

app.use(flash());
app.use(express.urlencoded({ extended: true })); // Use built-in body parser
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'img')));
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'images')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/temp', express.static('temp'));


const pool = new Pool({
  user: 'adcc_south_db_user',
  host: 'dpg-cpuq6caj1k6c738fpo4g-a.singapore-postgres.render.com',
  database: 'adcc_south_db',
  password: 'lyTGgs4y5MK3an2Wjk8gYkmSmyPCet82',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Inventory-Database',
//   password: 'hammad2405',
//   port: 5432,
// });

// Create a new client
const client = new Client({
  user: 'adcc_south_db_user',
  host: 'dpg-cpuq6caj1k6c738fpo4g-a.singapore-postgres.render.com',
  database: 'adcc_south_db',
  password: 'lyTGgs4y5MK3an2Wjk8gYkmSmyPCet82',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to the PostgreSQL server
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    // You can execute queries or perform other database operations here
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err.message);
  });

const fs = require('fs');

// Function to save base64 image data as a temporary file
function saveImage(data) {
  const filePath = `temp/temp_${Date.now()}.jpg`; // Example: temp_162456789.jpg
  fs.writeFileSync(filePath, data, 'base64');
  return filePath;
}

// Function to delete a file
function deleteFile(filePath) {
  fs.unlinkSync(filePath);
}


//   const createDatabaseQuery = `
//   CREATE DATABASE "Inventory-Database";
// `;

// // Function to execute the SQL command
// async function createDatabase() {
//   try {
//     const client = await pool.connect();
//     await client.query(createDatabaseQuery);
//     console.log('Database "Inventory-Database" created successfully.');
//     client.release();
//   } catch (err) {
//     console.error('Error creating database:', err);
//   } finally {
//     await pool.end();
//   }
// }

// //Call the function to create the database
// createDatabase();

// SQL command to create the users table
const createTableUsersQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    cnic VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL
  );
`;

// Function to execute the SQL command
async function createTableUsers() {
  try {
    const client = await pool.connect();
    await client.query(createTableUsersQuery);
    console.log('Table "users" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableUsers();

const createTableQueryN = `
CREATE TABLE IF NOT EXISTS notifications (
  sno SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false
);
`;

// Function to execute the create table query
async function createTableN() {
  try {
    const client = await pool.connect();
    await client.query(createTableQueryN);
    console.log('Table "notifications" created successfully');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error creating notifications table:', err);
  }
}

// Call the function to create the table
createTableN();

const createTableQueryNS = `
CREATE TABLE IF NOT EXISTS notifications_store (
  sno SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false
);
`;

async function createTableNS() {
  try {
    const client = await pool.connect();
    await client.query(createTableQueryNS);
    console.log('Table "notifications_store" created successfully');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error creating notifications table:', err);
  }
}

createTableNS();

const createTableQueryNQS = `
CREATE TABLE IF NOT EXISTS notifications_qs (
  sno SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false
);
`;

async function createTableNQS() {
  try {
    const client = await pool.connect();
    await client.query(createTableQueryNQS);
    console.log('Table "notifications_qs" created successfully');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error creating notifications_qs table:', err);
  }
}

createTableNQS();

const createTableQueryNQS2 = `
CREATE TABLE IF NOT EXISTS notifications_qs2 (
  sno SERIAL PRIMARY KEY,
  item_name varchar(255) NOT NULL,
  size VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false
);
`;

async function createTableNQS2() {
  try {
    const client = await pool.connect();
    await client.query(createTableQueryNQS2);
    console.log('Table "notifications_qs2" created successfully');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error creating notifications_qs table:', err);
  }
}

createTableNQS2();

const createTableBankBalanceQuery = `
  CREATE TABLE IF NOT EXISTS bank_balance (
    id SERIAL PRIMARY KEY,
    balance NUMERIC(10, 2)
  );
`;

// Function to execute the SQL command
async function createTableBankBalance() {
  try {
    const client = await pool.connect();
    await client.query(createTableBankBalanceQuery);
    console.log('Table "bank_balance" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableBankBalance();

const createTableExpense = `
  CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    voucer_id INT REFERENCES vouchers(voucher_id),
    expense NUMERIC(10, 2)
  );
`;

// Function to execute the SQL command
async function createTableExpensee() {
  try {
    const client = await pool.connect();
    await client.query(createTableExpense);
    console.log('Table "Expense" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableExpensee();

const createTableAllocatedInv = `
  CREATE TABLE IF NOT EXISTS allocated_inv (
    allocation_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    Size VARCHAR(50) NOT NULL,
    project_id INT NOT NULL REFERENCES projects(project_id),
    allocated_amount INT NOT NULL
  );
`;

// Function to execute the SQL command
async function createTableAllocatedInvv() {
  try {
    const client = await pool.connect(); // Assuming you have a pool instance named 'pool'
    await client.query(createTableAllocatedInv);
    console.log('Table "allocated_inv" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableAllocatedInvv();


const createTableEmployeesQuery = `
    CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100),
        salary NUMERIC(10, 2)
    )
`;

// Function to execute the SQL command
async function createTableEmployees() {
  try {
    const client = await pool.connect();
    await client.query(createTableEmployeesQuery);
    console.log('Table "bank balance" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableEmployees();

const createTableSalaryTransferredQuery = `
    CREATE TABLE IF NOT EXISTS salary_transferred (
        month_number SERIAL PRIMARY KEY,
        months_name VARCHAR(255),
        salary_transferred BOOLEAN,
        year INTEGER
    )
`;

// Function to execute the SQL command
async function createTableSalaryTransferred() {
  try {
    const client = await pool.connect();
    await client.query(createTableSalaryTransferredQuery);
    console.log('Table "salary_transferred" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the table
createTableSalaryTransferred();

async function createWarehouse1Table() {
  try {
    const createWarehouse1InventoryTableSql = `
          CREATE TABLE IF NOT EXISTS public."warehouse1inventory" (
              "S No" SERIAL NOT NULL,
              "ITEM" character varying(500) COLLATE pg_catalog."default" NOT NULL,
              "Size" character varying(50) COLLATE pg_catalog."default",
              "DENO" character varying(20) COLLATE pg_catalog."default",
              "Contract" character varying(50) COLLATE pg_catalog."default",
              "Contract Date" date,
              "Qty Per House" double precision,
              "Qty Required" double precision,
              CONSTRAINT "warehouse1inventory_pkey1" PRIMARY KEY ("S No")
          )
          TABLESPACE pg_default;
      `;

    await pool.query(createWarehouse1InventoryTableSql);
    console.log("Table 'warehouse1inventory' created (if not already existed).");
  } catch (error) {
    console.error("Error creating warehouse table:", error);
  }
}

createWarehouse1Table();

async function createWarehouse2Table() {
  try {
    const createWarehouse1InventoryTableSql = `
          CREATE TABLE IF NOT EXISTS public."warehouse2inventory" (
              "S No" SERIAL NOT NULL,
              "ITEM" character varying(500) COLLATE pg_catalog."default" NOT NULL,
              "Size" character varying(50) COLLATE pg_catalog."default",
              "DENO" character varying(20) COLLATE pg_catalog."default",
              "Contract" character varying(50) COLLATE pg_catalog."default",
              "Contract Date" date,
              "Qty Per House" double precision,
              "Qty Required" double precision,
              CONSTRAINT "warehouse1inventory_pkey2" PRIMARY KEY ("S No")
          )
          TABLESPACE pg_default;
      `;

    await pool.query(createWarehouse1InventoryTableSql);
    console.log("Table 'warehouse2inventory' created (if not already existed).");
  } catch (error) {
    console.error("Error creating warehouse table:", error);
  }
}

createWarehouse2Table();

async function createWarehouse3Table() {
  try {
    const createWarehouse3InventoryTableSql = `
          CREATE TABLE IF NOT EXISTS public."warehouse3inventory" (
              "S No" SERIAL NOT NULL,
              "ITEM" character varying(500) COLLATE pg_catalog."default" NOT NULL,
              "Size" character varying(50) COLLATE pg_catalog."default",
              "DENO" character varying(20) COLLATE pg_catalog."default",
              "Contract" character varying(50) COLLATE pg_catalog."default",
              "Contract Date" date,
              "Qty Per House" double precision,
              "Qty Required" double precision,
              CONSTRAINT "warehouse1inventory_pkey3" PRIMARY KEY ("S No")
          )
          TABLESPACE pg_default;
      `;

    await pool.query(createWarehouse3InventoryTableSql);
    console.log("Table 'warehouse3inventory' created (if not already existed).");
  } catch (error) {
    console.error("Error creating warehouse table:", error);
  }
}

createWarehouse3Table();

const createTableWarehousesQuery = `
  CREATE TABLE IF NOT EXISTS warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    warehouse_location VARCHAR(255) UNIQUE
  );
`;

// Function to create the warehouses table
async function createTableWarehouses() {
  try {
    const client = await pool.connect();
    await client.query(createTableWarehousesQuery);
    console.log('Table "warehouses" created successfully.');
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table
createTableWarehouses();

const createProjectsTableQuery = `
  CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) UNIQUE,
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    project_budget NUMERIC(12, 2),
    project_deadline DATE
  );
`;

// Function to execute the SQL command
async function createProjectsTable() {
  try {
    const client = await pool.connect();
    await client.query(createProjectsTableQuery);
    console.log('Table "projects" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating projects table:', err);
  }
}

// Call the function to create the table
createProjectsTable();

const createTableVouchersQuery = `
  CREATE TABLE IF NOT EXISTS vouchers (
    voucher_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    voucher_date DATE NOT NULL,
    payment NUMERIC(10, 2),
    approved BOOLEAN,
    image BYTEA
  );
`;

// Function to execute the SQL command to create the vouchers table
async function createTableVouchers() {
  try {
    const client = await pool.connect();
    await client.query(createTableVouchersQuery);
    console.log('Table "vouchers" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the vouchers table
createTableVouchers();

const createReceivingsQuery = `
  CREATE TABLE IF NOT EXISTS receivings (
    id SERIAL PRIMARY KEY,
    date_received date,
    item VARCHAR(50) NOT NULL,
    warehouse_id INT NOT NULL,
    approved BOOLEAN DEFAULT false
  );
`;

// Function to execute the SQL command to create the vouchers table
async function createTableReceivings() {
  try {
    const client = await pool.connect();
    await client.query(createReceivingsQuery);
    console.log('Table "receivings" created successfully.');
    client.release();
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

// Call the function to create the vouchers table
createTableReceivings();

// Function to create the table
const createTablePB = async () => {
  const createTablePBQuery = `
    CREATE TABLE IF NOT EXISTS project_boq (
      boq_id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(project_id),
      item_name VARCHAR(255) NOT NULL,
      size VARCHAR(255) NOT NULL,
      deno VARCHAR(255) NOT NULL,
      "limit" INTEGER NOT NULL
    );
  `;

  try {
    // Execute the query to create the table
    await pool.query(createTablePBQuery);
    console.log('Table "project_boq" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

createTablePB();

createTableReceivings();

// Function to create the table
const createTableVendor = async () => {
  const createTableVendorQuery = `
    CREATE TABLE IF NOT EXISTS vendors (
      vendor_id SERIAL PRIMARY KEY,
      vendor_name VARCHAR(255) NOT NULL,
      contact VARCHAR(255) NOT NULL,
      cnic VARCHAR(13) NOT NULL,
      works_on VARCHAR(100) NOT NULL,
      project_id INTEGER NOT NULL REFERENCES projects(project_id)
    );
  `;

  try {
    // Execute the query to create the table
    await pool.query(createTableVendorQuery);
    console.log('Table "vendors" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

createTableVendor();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/login', (req, res) => {
  res.render('login.ejs', { errorMessage: undefined });
});


app.get('/ceodashboard.html',  (req, res) => {
  res.sendFile(path.join(__dirname, 'ceodashboard.html'));
});

app.get('/storedashboard.html',  (req, res) => {
  res.sendFile(path.join(__dirname, 'storedashboard.html'));
});

app.get('/viewwarehouses-for-inventory.html',  (req, res) => {
  res.sendFile(path.join(__dirname, 'viewwarehouses-for-inventory.html'));
});

app.get('/viewwarehouses',  async (req, res) => {
  try {
    // Fetch warehouses from the database
    const result = await pool.query('SELECT * FROM warehouses');
    const warehouses = result.rows;

    // Render the viewwarehouses page and pass the warehouses data
    res.render('viewwarehouses', { warehouses });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).send('Error fetching warehouses');
  }
});

app.get('/warehouses_forstore',  async (req, res) => {
  try {
    // Fetch warehouses from the database
    const result = await pool.query('SELECT * FROM warehouses');
    const warehouses = result.rows;

    // Render the viewwarehouses page and pass the warehouses data
    res.render('warehouses_forstore', { warehouses });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).send('Error fetching warehouses');
  }
});

app.get('/viewwarehouses-fromfinance',  async (req, res) => {
  try {
    // Fetch warehouses from the database
    const result = await pool.query('SELECT * FROM warehouses');
    const warehouses = result.rows;

    // Render the viewwarehouses page and pass the warehouses data
    res.render('viewwarehouses-fromfinance', { warehouses });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).send('Error fetching warehouses');
  }
});

app.get('/viewwarehouses-fromstore',  async (req, res) => {
  try {
    // Fetch warehouses from the database
    const result = await pool.query('SELECT * FROM warehouses');
    const warehouses = result.rows;

    // Render the viewwarehouses page and pass the warehouses data
    res.render('viewwarehouses-fromstore', { warehouses });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).send('Error fetching warehouses');
  }
});

app.get('/viewwarehouse1',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 1');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewwarehouse1', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 1 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewwarehouse1-others',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 1');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewwarehouse1-others', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 1 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewwarehouse2', async (req, res) => {
  try {
    // Fetch projects of Warehouse 2 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 2');
    const projects = result.rows;

    // Render the viewwarehouse2.ejs template with the fetched projects
    res.render('viewwarehouse2', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 2 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewwarehouse2-others',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 2');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewwarehouse2-others', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 2 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewwarehouse3',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 3 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 3');
    const projects = result.rows;

    // Render the viewwarehouse3.ejs template with the fetched projects
    res.render('viewwarehouse3', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 3 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewwarehouse3-others',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 3');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewwarehouse3-others', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 3 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewprojects1',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 1');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewprojects1', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 1 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewprojects2',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 2');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewprojects2', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 2 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewprojects3',  async (req, res) => {
  try {
    // Fetch projects of Warehouse 1 from the database
    const result = await pool.query('SELECT * FROM projects WHERE warehouse_id = 3');
    const projects = result.rows;

    // Render the viewwarehouse1.ejs template with the fetched projects
    res.render('viewprojects3', { projects });
  } catch (error) {
    console.error('Error fetching Warehouse 3 projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewvendors',  async (req, res) => {
  const { projectId } = req.params;
  try {
      const result = await pool.query('SELECT * FROM vendors');
      const vendors = result.rows;

      // Render the viewvendors.ejs template with the fetched vendors
      res.render('viewvendors', { vendors });
  } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/viewfinance',  async (req, res) => {
  try {
    // Fetch all vouchers from the database
    const result = await pool.query('SELECT * FROM vouchers');

    const vouchers = result.rows.map(voucher => ({
      voucher_id: voucher.voucher_id,
      project_id: voucher.project_id,
      voucher_date: voucher.voucher_date,
      payment: voucher.payment,
      approved: voucher.approved,
      image: saveImage(voucher.image)
    }));

    // Render the viewfinance.ejs template with the fetched vouchers
    res.render('viewfinance', { vouchers });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/notceo',  async (req, res) => {
  try {
    // Fetch messages from the notifications table
    const result = await pool.query('SELECT * FROM notifications WHERE read = false');
    const notifications = result.rows;

    // Render the notceo.ejs template with the fetched notifications
    res.render('notceo', { notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/notqs',  async (req, res) => {
  try {
    // Fetch messages from the notifications table
    const result = await pool.query('SELECT * FROM notifications_qs WHERE read = false');
    const notifications = result.rows;
    // Render the notceo.ejs template with the fetched notifications
    res.render('notqs', { notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/markasread_not_qs', async (req, res) => {
  try {
    await client.query('BEGIN');
    const { readMessages } = req.body;

    // If readMessages is an array of sno values
    if (Array.isArray(readMessages)) {
      // Update the read status in the notifications table for each selected message
      const updatePromises = readMessages.map(async (sno) => {
        await pool.query('UPDATE notifications_qs SET read = true WHERE sno = $1', [sno]);
      });
      await Promise.all(updatePromises);
      console.log('Messages marked as read successfully');
    } else if (readMessages) {
      // If only one message is selected
      await pool.query('UPDATE notifications_qs SET read = true WHERE sno = $1', [readMessages]);
      console.log('Message marked as read successfully');
    }
    await client.query('COMMIT');
    // Redirect to the notifications page after updating
    res.redirect('/notqs');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error marking messages as read:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/markasread', async (req, res) => {
  try {
    await client.query('BEGIN');
    const { readMessages } = req.body;

    // If readMessages is an array of sno values
    if (Array.isArray(readMessages)) {
      // Update the read status in the notifications table for each selected message
      const updatePromises = readMessages.map(async (sno) => {
        await pool.query('UPDATE notifications SET read = true WHERE sno = $1', [sno]);
        await pool.query('UPDATE receivings SET approved = true WHERE id = $1', [sno]);
      });
      await Promise.all(updatePromises);
      console.log('Messages marked as read successfully');
    } else if (readMessages) {
      // If only one message is selected
      await pool.query('UPDATE notifications SET read = true WHERE sno = $1', [readMessages]);
      console.log('Message marked as read successfully');
      await pool.query('UPDATE receivings SET approved = true WHERE id = $1', [readMessages]);
      console.log('Message marked as read successfully');
    }
    await client.query('COMMIT');
    // Redirect to the notifications page after updating
    res.redirect('/notceo');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error marking messages as read:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/notstore', async (req, res) => {
  try {
    // Fetch messages from the notifications table
    const result = await pool.query('SELECT * FROM notifications_store WHERE read = false');
    const notifications = result.rows;

    // Render the notceo.ejs template with the fetched notifications
    res.render('notstore', { notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/markasread_not_store', async (req, res) => {
  try {
    await client.query('BEGIN');
    const { readMessages } = req.body;

    // If readMessages is an array of sno values
    if (Array.isArray(readMessages)) {
      // Update the read status in the notifications table for each selected message
      const updatePromises = readMessages.map(async (sno) => {
        await pool.query('UPDATE notifications_store SET read = true WHERE sno = $1', [sno]);
      });
      await Promise.all(updatePromises);
      console.log('Messages marked as read successfully');
    } else if (readMessages) {
      // If only one message is selected
      await pool.query('UPDATE notifications_store SET read = true WHERE sno = $1', [readMessages]);
      console.log('Message marked as read successfully');
    }
    await client.query('COMMIT');
    // Redirect to the notifications page after updating
    res.redirect('/notstore');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error marking messages as read:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/settings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
});

app.get('/adduser', (req, res) => {
  res.render('adduser.ejs', { errorMessage: undefined });
});

// Route to serve the HTML page for deleting users
app.get('/deleteuser', async (req, res) => {
  try {
    // Fetch user entries from the database
    const getUsersQuery = 'SELECT * FROM users WHERE id != 1';
    const users = await pool.query(getUsersQuery);
    // Render the HTML page and pass the user entries to dynamically populate the table
    res.render('deleteuser', { users: users.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET request to render the update user page
app.get('/updateuser.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'updateuser.html'));
});

app.get('/findashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'findashboard.html'));
});

app.get('/qsdashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'qsdashboard.html'));
});

app.get('/addprojects', (req, res) => {
  const errorMessages = req.flash('errorMessages');
  const successMessage = req.flash('successMessage');
  res.render('addprojects', { errorMessages, successMessage });
});


app.get('/warehouse1.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'warehouse1.html'));
});

app.get('/allocateinv1', (req, res) => {
  res.render('allocateinv1', {
    errorMessages: req.flash('errorMessages'),
    successMessage: req.flash('successMessage')
  });
});


app.get('/allocateinv2', (req, res) => {
  res.render('allocateinv2', {
    errorMessages: req.flash('errorMessages'),
    successMessage: req.flash('successMessage')
  });
});


app.get('/allocateinv3', (req, res) => {
  res.render('allocateinv3', {
    errorMessages: req.flash('errorMessages'),
    successMessage: req.flash('successMessage')
  });
});


app.get('/warehouse2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'warehouse2.html'));
});

app.get('/warehouse3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'warehouse3.html'));
});

app.get('/sharevendordetails', (req, res) => {
  const projectId = req.query.project_id; // Retrieve project_id from query parameters
  res.render('sharevendordetails', { projectId, 
    errorMessages: req.flash('errorMessages'),
    successMessage: req.flash('successMessage')
  }); 
});

app.get('/vendordetails', async (req, res) => {
  try {
    const result = await pool.query('SELECT vendor_id, vendor_name, contact, cnic, works_on, project_id FROM vendors');
    const vendors = result.rows;
    res.render('vendordetails', { vendors });
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/updateboq.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'updateboq.html'));
});

// Inside your route handler
app.get('/projectdetails-warehouse1/:projectId', async (req, res) => {
  const projectId = parseInt(req.params.projectId);

  try {
    // Fetch project details from the database
    const projectResult = await pool.query('SELECT project_name, project_deadline, project_budget FROM projects WHERE project_id = $1', [projectId]);
    const project = projectResult.rows[0];

    // Fetch vouchers for the project from the database
    const voucherResult = await pool.query('SELECT voucher_id, voucher_date, image FROM vouchers WHERE project_id = $1', [projectId]);
    const vouchers = voucherResult.rows.map(voucher => ({
      voucher_id: voucher.voucher_id,
      voucher_issue_date: voucher.voucher_date,
      image: saveImage(voucher.image)
    }));

    // Calculate total spent
    const totalSpentResult = await pool.query('SELECT SUM(payment) AS total_spent FROM vouchers WHERE project_id = $1', [projectId]);
    const totalSpent = totalSpentResult.rows[0].total_spent;

    // Render the projectdetails-warehouse1.ejs template with project details, vouchers, and total spent
    res.render('projectdetails-warehouse1', { project, vouchers, totalSpent });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/projectdetails-warehouse2/:projectId', async (req, res) => {
  const projectId = parseInt(req.params.projectId);

  try {
    // Fetch project details from the database
    const projectResult = await pool.query('SELECT project_name, project_deadline, project_budget FROM projects WHERE project_id = $1', [projectId]);
    const project = projectResult.rows[0];

    // Fetch vouchers for the project from the database
    const voucherResult = await pool.query('SELECT voucher_id, issue_date, image FROM vouchers WHERE project_id = $1', [projectId]);
    const vouchers = voucherResult.rows.map(voucher => ({
      voucher_id: voucher.voucher_id,
      voucher_issue_date: voucher.voucher_date,
      image: saveImage(voucher.image)
    }));

    // Calculate total spent
    const totalSpentResult = await pool.query('SELECT SUM(payment) AS total_spent FROM vouchers WHERE project_id = $1', [projectId]);
    const totalSpent = totalSpentResult.rows[0].total_spent;

    // Render the projectdetails-warehouse1.ejs template with project details, vouchers, and total spent
    res.render('projectdetails-warehouse2', { project, vouchers, totalSpent });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/projectdetails-warehouse3/:projectId', async (req, res) => {
  const projectId = parseInt(req.params.projectId);

  try {
    // Fetch project details from the database
    const projectResult = await pool.query('SELECT project_name, project_deadline, project_budget FROM projects WHERE project_id = $1', [projectId]);
    const project = projectResult.rows[0];

    // Fetch vouchers for the project from the database
    const voucherResult = await pool.query('SELECT voucher_id, issue_date, image FROM vouchers WHERE project_id = $1', [projectId]);
    const vouchers = voucherResult.rows.map(voucher => ({
      voucher_id: voucher.voucher_id,
      voucher_issue_date: voucher.voucher_date,
      image: saveImage(voucher.image)
    }));

    let totalSpent = 0;
    const totalSpentResult = await pool.query('SELECT SUM(payment) AS total_spent FROM vouchers WHERE project_id = $1', [projectId]);
    const totalSpentRow = totalSpentResult.rows[0];

    if (totalSpentRow && totalSpentRow.total_spent !== null) {
      totalSpent = totalSpentRow.total_spent;
    }

    // Render the projectdetails-warehouse1.ejs template with project details, vouchers, and total spent
    res.render('projectdetails-warehouse3', { project, vouchers, totalSpent });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/temp/:image', (req, res) => {
  const imagePath = path.join(__dirname, 'temp', 'temp_' + req.params.image);
  res.sendFile(imagePath);
});

app.get('/generatevouchers', (req, res) => {
  const errorMessages = req.flash('errorMessages');
  const successMessage = req.flash('successMessage');
  res.render('generatevouchers.ejs', { errorMessages, successMessage });
});

app.get('/viewinventory1', async (req, res) => {
  try {
    // Query the 'Inventory' table to retrieve all inventory data
    const result = await pool.query('SELECT * FROM "warehouse1inventory"');
    const inventory = result.rows;

    // Render the viewinventory.ejs template with the fetched inventory data
    res.render('viewinventory1', { inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addinventory1', (req, res) => {
  const errorMessages = req.flash('errorMessages');
  const successMessage = req.flash('successMessage');
  res.render('addinventory1', { errorMessages, successMessage });
});

app.get('/beforeinventoryadd1', async (req, res) => {
  try {
    await client.query('BEGIN');
    const currentDate = new Date().toISOString().split('T')[0];
    // Fetch items from the database table receivings
    const result = await pool.query('SELECT * FROM receivings WHERE warehouse_id = 1');
    //const items = result.rows;

    // Check if items' date_received is not equal to currentDate
    // items.forEach(async (item) => {
    //   const receivedDate = item.date_received.toISOString().split('T')[0];
    //   // if (new Date(item.date_received).toLocaleDateString('en-GB') !== new Date(currentDate).toLocaleDateString('en-GB')) {
    //   //   // If not equal, insert notification into the notifications table
    //   //   await pool.query('INSERT INTO notifications (message, read, warehouse_id) VALUES ($1, $2, $3)', [`Inventory "${item.item}" not added on the same day it was received.`, false, 1]);
    //   // }
    // });
    const items = result.rows.map(item1 => ({
      item_name: item1.item,
      date_received: item1.date_received,
      size: item1.Size,
      image: saveImage(item1.PO)
    }));
    await client.query('COMMIT');
    // Render the selectitems.ejs template with the fetched items
    res.render('beforeinventoryadd1', { items, currentDate: currentDate });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/beforeinventoryadd2', async (req, res) => {
  try {
    await client.query('BEGIN');
    const currentDate = new Date().toISOString().split('T')[0];
    // Fetch items from the database table receivings
    const result = await pool.query('SELECT * FROM receivings WHERE warehouse_id = 2');
    //const items = result.rows;

    // Check if items' date_received is not equal to currentDate
    // items.forEach(async (item) => {
    //   const receivedDate = item.date_received.toISOString().split('T')[0];
    //   // if (new Date(item.date_received).toLocaleDateString('en-GB') !== new Date(currentDate).toLocaleDateString('en-GB')) {
    //   //   // If not equal, insert notification into the notifications table
    //   //   await pool.query('INSERT INTO notifications (message, read, warehouse_id) VALUES ($1, $2, $3)', [`Inventory "${item.item}" not added on the same day it was received.`, false, 1]);
    //   // }
    // });
    const items = result.rows.map(item1 => ({
      item_name: item1.item,
      date_received: item1.date_received,
      size: item1.Size,
      image: saveImage(item1.PO)
    }));
    await client.query('COMMIT');
    // Render the selectitems.ejs template with the fetched items
    res.render('beforeinventoryadd2', { items, currentDate: currentDate });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/beforeinventoryadd3', async (req, res) => {
  try {
    await client.query('BEGIN');
    const currentDate = new Date().toISOString().split('T')[0];
    // Fetch items from the database table receivings
    const result = await pool.query('SELECT * FROM receivings WHERE warehouse_id = 3');
    //const items = result.rows;

    // Check if items' date_received is not equal to currentDate
    // items.forEach(async (item) => {
    //   const receivedDate = item.date_received.toISOString().split('T')[0];
    //   // if (new Date(item.date_received).toLocaleDateString('en-GB') !== new Date(currentDate).toLocaleDateString('en-GB')) {
    //   //   // If not equal, insert notification into the notifications table
    //   //   await pool.query('INSERT INTO notifications (message, read, warehouse_id) VALUES ($1, $2, $3)', [`Inventory "${item.item}" not added on the same day it was received.`, false, 1]);
    //   // }
    // });
    const items = result.rows.map(item1 => ({
      item_name: item1.item,
      date_received: item1.date_received,
      size: item1.Size,
      image: saveImage(item1.PO)
    }));
    await client.query('COMMIT');
    // Render the selectitems.ejs template with the fetched items
    res.render('beforeinventoryadd3', { items, currentDate: currentDate });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/viewinventory2', async (req, res) => {
  try {
    // Query the 'Inventory' table to retrieve all inventory data
    const result = await pool.query('SELECT * FROM "warehouse2inventory"');
    const inventory = result.rows;

    // Render the viewinventory.ejs template with the fetched inventory data
    res.render('viewinventory2', { inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addinventory2', (req, res) => {
  const errorMessages = req.flash('errorMessages');
  const successMessage = req.flash('successMessage');
  res.render('addinventory2', { errorMessages, successMessage });
});

app.get('/viewinventory3', async (req, res) => {
  try {
    // Query the 'Inventory' table to retrieve all inventory data
    const result = await pool.query('SELECT * FROM "warehouse3inventory"');
    const inventory = result.rows;

    // Render the viewinventory.ejs template with the fetched inventory data
    res.render('viewinventory3', { inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addinventory3', (req, res) => {
  const errorMessages = req.flash('errorMessages');
  const successMessage = req.flash('successMessage');
  res.render('addinventory3', { errorMessages, successMessage });
});

// Route to render the approvevouchers.ejs template
// Route to render the approvevouchers.ejs template
app.get('/approvevouchers', (req, res) => {
  // Query non-approved vouchers from the database
  const query = 'SELECT * FROM vouchers WHERE approved = false';
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error querying vouchers:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Extract vouchers from the result.rows array
    const vouchers = result.rows;
    // Render the approvevouchers.ejs template with the vouchers data
    res.render('approvevouchers', { vouchers });
  });
});

// Route to render the payslips view
// app.get('/payslips', async (req, res) => {
//   try {
//     // Fetch employees from the database
//     const employeesQuery = 'SELECT * FROM employees';
//     const employeesResult = await pool.query(employeesQuery);
//     const employees = employeesResult.rows;

//     // Render the payslips view with the employees data
//     res.render('payslips', { employees });
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.post('/updateboq', async (req, res) => {
  const { project_id, item_name, size, limit } = req.body;

  try {
    await client.query('BEGIN');
      // Update the limit in the project_boq table
      const updateQuery = 'UPDATE project_boq SET "limit" = $1 WHERE project_id = $2 AND item_name = $3 AND size = $4';
      await pool.query(updateQuery, [limit, project_id, item_name, size]);
      await client.query('COMMIT');
      res.status(200).send('BOQ limit updated successfully');
  } catch (error) {
    await client.query('ROLLBACK');
      console.error('Error updating BOQ limit:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Define the route to render the transfersalary.ejs page
app.get('/transfersalary', async (req, res) => {
  try {
    // Fetch distinct months for which salary hasn't been transferred yet
    const distinctMonthsQuery = 'SELECT DISTINCT month_number, months_name FROM salary_transferred WHERE salary_transferred = false';
    const { rows: months } = await pool.query(distinctMonthsQuery);

    // Fetch all transferred salaries
    const transferredSalariesQuery = 'SELECT * FROM salary_transferred';
    const { rows: transferredSalaries } = await pool.query(transferredSalariesQuery);

    // Render the transfersalary.ejs page with data
    res.render('transfersalary', { months, transferredSalaries });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/receivinginventory', (req, res) => {
  res.render('receivinginventory.ejs', { errorMessage: undefined });
});


app.post('/login', async (req, res) => {
  const { cnic, password } = req.body;

  try {
    // Query the users table to check if a user with the provided cnic and password exists
    const result = await pool.query(
      'SELECT * FROM users WHERE cnic = $1 AND password = $2',
      [cnic, password]
    );

    // If a user is found
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const role = user.cnic; // Assuming there's a column named 'role' in the users table
      req.session.user = { cnic: user.cnic }; 
      // Redirect the user based on their role
      switch (role) {
        case '1111111111111':
          res.redirect(`/ceodashboard.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '2222222222222':
          res.redirect(`/qsdashboard.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '3333333333333':
          res.redirect(`/findashboard.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '4444444444444':
          res.redirect(`/storedashboard.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '5555555555555':
          res.redirect(`/warehouse1.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '6666666666666':
          res.redirect(`/warehouse2.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        case '7777777777777':
          res.redirect(`/warehouse3.html?cnic=${encodeURIComponent(encryptCNIC)}`);
          break;
        default:
          res.send('Unknown role.');
      }
    } else {
      req.flash('error', 'Invalid cnic or password');
      res.render('login.ejs', { errorMessage: req.flash('error') });
      } 
  } 
   catch (error) {
    console.error('Error querying the database', error);
    res.status(500).send('Internal Server Error');
  }
});

// Assuming you have already set up Express and the required middleware

app.post('/ceodashboard.html', (req, res) => {
  // Check which button was clicked
  const { action } = req.body;

  // Based on the action, redirect to the respective page
  switch (action) {
    case 'view_warehouses':
      res.redirect('/view-warehouses.html');
      break;
    case 'view_finance':
      res.redirect('/view-finance.html');
      break;
    case 'view_qs':
      res.redirect('/view-qs.html');
      break;
    case 'notifications':
      res.redirect('/notifications.html');
      break;
    case 'settings':
      res.redirect('/settings.html');
      break;
    default:
      res.redirect('/ceodashboard.html'); // Redirect to dashboard if no action is specified
  }
});

app.post('/adduser', async (req, res) => {
  const { cnic, password } = req.body;

  if (cnic.length !== 13) {
    req.flash('error', 'CNIC must be 13 digits long.');
    return res.render('adduser.ejs', { errorMessage: req.flash('error') }); // Add return statement
  }

  try {
    await client.query('BEGIN');
    // Check if the CNIC already exists
    const checkUserQuery = 'SELECT * FROM users WHERE cnic = $1';
    const userExists = await pool.query(checkUserQuery, [cnic]);

    if (userExists.rows.length > 0) {
      // CNIC already exists, return an error
      req.flash('error', 'CNIC already exists. Please choose another CNIC.');
      return res.render('adduser', { errorMessage: req.flash('error') }); // Add return statement
    }

    // If the CNIC is unique, insert the user into the database
    const insertUserQuery = 'INSERT INTO users (cnic, password) VALUES ($1, $2)';
    await pool.query(insertUserQuery, [cnic, password]);
    await client.query('COMMIT');
    // User successfully added to the database
    req.flash('success', 'User added successfully.');
    res.render('adduser', { successMessage: req.flash('success') });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding user:', error);
    req.flash('error', 'Internal Server Error');
    res.render('adduser', { errorMessage: req.flash('error') });
  }
});



app.post('/deleteuser', async (req, res) => {
  try {
    // Retrieve selected user IDs from the request body
    const selectedUserIds = req.body.userIds;

    // Delete selected user(s) from the database
    const deleteUserQuery = 'DELETE FROM users WHERE id IN ($1)';
    await pool.query(deleteUserQuery, [selectedUserIds]);

    // Redirect back to the delete user page after deletion
    res.redirect('/deleteuser');
  } catch (error) {
    console.error('Error deleting user(s):', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/updateuser', async (req, res) => {
  const { cnic, newcnic, newPassword } = req.body;

  try {
    await client.query('BEGIN');
    // Update the user in the database
    const query = 'UPDATE users SET cnic = $1, password = $2 WHERE cnic = $3';
    const result = await pool.query(query, [newcnic, newPassword, cnic]);

    if (result.rowCount > 0) {
      res.send('User updated successfully!');
    } else {
      res.send('No user found with the provided ID.');
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/generatevouchers', upload.single('image'), async (req, res) => {
  const { project_id, voucher_date, payment, received } = req.body;
  const image = req.file ? req.file.buffer : null;

  // Validation
  const errors = [];

  // Check if project_id is an integer
  if (!project_id || isNaN(parseInt(project_id))) {
    errors.push('Project ID must be an integer.');
  }

  // Check if voucher_date is provided and not before the current date
  const currentDate = new Date();
  const selectedDate = new Date(voucher_date);
  if (!voucher_date || selectedDate < currentDate.setHours(0, 0, 0, 0)) {
    errors.push('Voucher date cannot be before today.');
  }

  // Check if payment is a number
  if (!payment || isNaN(parseFloat(payment))) {
    errors.push('Payment must be a number.');
  }

  // Check if received is selected
  if (!received || (received !== 'yes' && received !== 'no')) {
    errors.push('Received must be selected.');
  }

  // Check if image is provided
  if (!image) {
    errors.push('Image must be uploaded.');
  }

  if (errors.length > 0) {
    req.flash('errorMessages', errors);
    return res.redirect('/generatevouchers');
  }

  try {
    await pool.query('BEGIN');

    // Check if the project exists
    const checkProjectQuery = 'SELECT * FROM projects WHERE project_id = $1';
    const projectExists = await pool.query(checkProjectQuery, [project_id]);

    if (projectExists.rows.length === 0) {
      req.flash('errorMessages', ['Project does not exist']);
      await pool.query('ROLLBACK');
      return res.redirect('/generatevouchers');
    }

    // Insert voucher into the database
    const insertVoucherQuery = 'INSERT INTO vouchers (project_id, voucher_date, payment, approved, image) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(insertVoucherQuery, [project_id, voucher_date, payment, received === 'yes', image]);

    // Get the last inserted voucher ID
    const fetchVouchers = 'SELECT voucher_id FROM vouchers ORDER BY voucher_id DESC LIMIT 1';
    const result = await pool.query(fetchVouchers);
    const lastVoucherId = result.rows[0].voucher_id;

    // Insert into the expense table
    const insertExpenseQuery = 'INSERT INTO expense (voucher_id, expense) VALUES ($1, $2)';
    await pool.query(insertExpenseQuery, [lastVoucherId, payment]);

    await pool.query('COMMIT');

    req.flash('successMessage', 'Voucher generated successfully!');
    res.redirect('/generatevouchers');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error generating voucher:', error);
    req.flash('errorMessages', ['Error generating voucher']);
    res.redirect('/generatevouchers');
  }
});

// Route to handle voucher approval
app.post('/approvevouchers', async (req, res) => {
  const voucher_id = req.body.voucher_id;

  try {
    await client.query('BEGIN');

    // Update the approved status of the voucher in the database to true
    const query = 'UPDATE vouchers SET approved = true WHERE voucher_id = $1';
    await pool.query(query, [voucher_id]);
    await client.query('COMMIT');
    // Redirect to the approvevouchers page after approval
    res.redirect('/approvevouchers');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving voucher:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle salary transfer form submission
app.post('/transferSalary', async (req, res) => {
  try {
    // Fetch all transferred salaries
    const transferredSalariesQuery = 'SELECT * FROM salary_transferred';
    const transferredSalariesResult = await pool.query(transferredSalariesQuery);
    const transferredSalaries = transferredSalariesResult.rows;

    // Fetch distinct years
    const distinctYearsQuery = 'SELECT DISTINCT year FROM salary_transferred';
    const distinctYearsResult = await pool.query(distinctYearsQuery);
    const distinctYears = distinctYearsResult.rows;

    // Render the transfersalary.ejs page with the transferred salaries and distinct years data
    res.render('transfersalary', { transferredSalaries, months: transferredSalaries, distinctYears: distinctYears });
  } catch (error) {
    console.error('Error handling salary transfer:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/transfersalaryconfirmed', async (req, res) => {
  try {
    await client.query('BEGIN');
    const { selectedMonth, selectedYear } = req.body;

    // Update the salary transferred status in the database for the selected month and year
    const updateSalaryQuery = 'UPDATE salary_transferred SET salary_transferred = true WHERE month_number = $1 AND year = $2';
    await pool.query(updateSalaryQuery, [selectedMonth, selectedYear]);
    await client.query('COMMIT');
    // Redirect back to the transfersalary page after the salary has been transferred
    res.redirect('/transferSalary');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error transferring salary:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Handle form submission to add inventory
app.post('/addinventory1', async (req, res) => {
  try {
    const { item, size, deno, qtyrequired, price } = req.body;

    // Validation checks
    if (!item || !size || !deno || !qtyrequired || !price) {
      req.flash('error_msg', 'All fields are required.');
      return res.redirect('/addinventory1');
    }

    if (isNaN(price)) {
      req.flash('error_msg', 'Price must be a numeric value.');
      return res.redirect('/addinventory1');
    }

    await client.query('BEGIN');

    // Insert the inventory into the database
    const insertQuery = `
      INSERT INTO public."warehouse1inventory" ("ITEM", "Size", "DENO", "Qty Required", "price")
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [item, size, deno, qtyrequired, price]);

    const recvdelQuery = `
      DELETE FROM receivings 
      WHERE date_received::date = CURRENT_DATE 
      AND warehouse_id = 1 
      AND receivings.item = $1;
    `;
    await pool.query(recvdelQuery, [item]);
    await client.query('COMMIT');

    req.flash('successMessage', 'Inventory added successfully.');
    res.redirect('/addinventory1');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding inventory:', error);
    req.flash('error_msg', 'Internal Server Error.');
    res.redirect('/addinventory1');
  }
});



app.post('/allocateinv1', async (req, res) => {
  const { project_id, item_name, size, amount } = req.body;

  // Validation checks
  if (!project_id || !item_name || !size || !amount) {
    req.flash('errorMessages', 'All fields are required.');
    return res.redirect('/allocateinv1');
  }

  if (isNaN(project_id) || !Number.isInteger(Number(project_id))) {
    req.flash('errorMessages', 'Project ID must be an integer.');
    return res.redirect('/allocateinv1');
  }

  if (isNaN(amount) || !Number.isInteger(Number(amount))) {
    req.flash('errorMessages', 'Allocated amount must be an integer.');
    return res.redirect('/allocateinv1');
  }

  try {
    await client.query('BEGIN');

    // Check if the project exists
    const projectExistsQuery = 'SELECT * FROM projects WHERE project_id = $1';
    const projectExistsResult = await pool.query(projectExistsQuery, [project_id]);
    if (projectExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Project not found');
      return res.redirect('/allocateinv1');
    }

    // Check if the item exists in inventory
    const itemExistsQuery = 'SELECT * FROM warehouse1inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const itemExistsResult = await pool.query(itemExistsQuery, [item_name, size]);
    if (itemExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Item not found in inventory');
      return res.redirect('/allocateinv1');
    }

    // Check if the allocated amount is not greater than the available quantity
    const availableQuantityQuery = 'SELECT "Qty Required" FROM warehouse1inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const availableQuantityResult = await pool.query(availableQuantityQuery, [item_name, size]);
    const availableQuantity = availableQuantityResult.rows[0]["Qty Required"];
    if (amount > availableQuantity) {
      req.flash('errorMessages', 'Allocated amount exceeds available quantity');
      return res.redirect('/allocateinv1');
    }

    // Check if the allocated amount does not exceed the BOQ limit
    const boqQuery = 'SELECT "limit" FROM project_boq WHERE project_id = $1 AND item_name = $2 AND size = $3';
    const boqResult = await pool.query(boqQuery, [project_id, item_name, size]);
    if (boqResult.rows.length === 0) {
      req.flash('errorMessages', 'BOQ limit not found for this item and project');
      return res.redirect('/allocateinv1');
    }
    const boqLimit = boqResult.rows[0].limit;
    if (amount > boqLimit) {
      const message2 = `BOQ ALERT! ${item_name} size ${size} for project ${project_id} has exceeded its BOQ limit.`;
      const notqs = 'INSERT INTO notifications_qs (message, read, project_id, item_name, size) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(notqs, [message2, false, project_id, item_name, size]);
      req.flash('errorMessages', 'Allocated amount exceeds BOQ limit');
      return res.redirect('/allocateinv1');
    }

    // Proceed with allocation
    const afterdeduct = availableQuantity - amount;
    if (afterdeduct < (availableQuantity * 0.75)) {
      const message = `Alert! Item ${item_name} (size ${size}) stock has depleted below 75%`;
      const notceo = 'INSERT INTO notifications (message, read) VALUES ($1, $2)';
      await pool.query(notceo, [message, false]);

      const notstore = 'INSERT INTO notifications_store (message, read) VALUES ($1, $2)';
      await pool.query(notstore, [message, false]);
    }

    // Insert the entry into allocated_inv table
    const insertQuery = 'INSERT INTO allocated_inv (item_name, Size, project_id, allocated_amount) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, [item_name, size, project_id, amount]);

    // Deduct the allocated amount from the inventory
    const updateInventoryQuery = 'UPDATE warehouse1inventory SET "Qty Required" = "Qty Required" - $1 WHERE "ITEM" = $2 AND "Size" = $3';
    await pool.query(updateInventoryQuery, [amount, item_name, size]);
    await client.query('COMMIT');
    
    req.flash('successMessage', 'Allocation successful');
    res.redirect('/allocateinv1');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    req.flash('errorMessages', 'Internal Server Error');
    res.redirect('/allocateinv1');
  }
});




app.post('/addinventory2', async (req, res) => {
  try {
    const { item, size, deno, qtyrequired, price } = req.body;

    // Validation checks
    if (!item || !size || !deno || !qtyrequired || !price) {
      req.flash('error_msg', 'All fields are required.');
      return res.redirect('/addinventory2');
    }

    if (isNaN(price)) {
      req.flash('error_msg', 'Price must be a numeric value.');
      return res.redirect('/addinventory2');
    }

    await client.query('BEGIN');

    // Insert the inventory into the database
    const insertQuery = `
      INSERT INTO public."warehouse2inventory" ("ITEM", "Size", "DENO", "Qty Required", "price")
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [item, size, deno, qtyrequired, price]);

    const recvdelQuery = `
      DELETE FROM receivings 
      WHERE date_received::date = CURRENT_DATE 
      AND warehouse_id = 2 
      AND receivings.item = $1;
    `;
    await pool.query(recvdelQuery, [item]);
    await client.query('COMMIT');

    req.flash('successMessage', 'Inventory added successfully.');
    res.redirect('/addinventory2');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding inventory:', error);
    req.flash('error_msg', 'Internal Server Error.');
    res.redirect('/addinventory2');
  }
});

app.post('/allocateinv2', async (req, res) => {
  const { project_id, item_name, size, amount } = req.body;

  // Validation checks
  if (!project_id || !item_name || !size || !amount) {
    req.flash('errorMessages', 'All fields are required.');
    return res.redirect('/allocateinv2');
  }

  if (isNaN(project_id) || !Number.isInteger(Number(project_id))) {
    req.flash('errorMessages', 'Project ID must be an integer.');
    return res.redirect('/allocateinv2');
  }

  if (isNaN(amount) || !Number.isInteger(Number(amount))) {
    req.flash('errorMessages', 'Allocated amount must be an integer.');
    return res.redirect('/allocateinv2');
  }

  try {
    await client.query('BEGIN');

    // Check if the project exists
    const projectExistsQuery = 'SELECT * FROM projects WHERE project_id = $1';
    const projectExistsResult = await pool.query(projectExistsQuery, [project_id]);
    if (projectExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Project not found');
      return res.redirect('/allocateinv2');
    }

    // Check if the item exists in inventory
    const itemExistsQuery = 'SELECT * FROM warehouse2inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const itemExistsResult = await pool.query(itemExistsQuery, [item_name, size]);
    if (itemExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Item not found in inventory');
      return res.redirect('/allocateinv2');
    }

    // Check if the allocated amount is not greater than the available quantity
    const availableQuantityQuery = 'SELECT "Qty Required" FROM warehouse2inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const availableQuantityResult = await pool.query(availableQuantityQuery, [item_name, size]);
    const availableQuantity = availableQuantityResult.rows[0]["Qty Required"];
    if (amount > availableQuantity) {
      req.flash('errorMessages', 'Allocated amount exceeds available quantity');
      return res.redirect('/allocateinv2');
    }

    // Check if the allocated amount does not exceed the BOQ limit
    const boqQuery = 'SELECT "limit" FROM project_boq WHERE project_id = $1 AND item_name = $2 AND size = $3';
    const boqResult = await pool.query(boqQuery, [project_id, item_name, size]);
    if (boqResult.rows.length === 0) {
      req.flash('errorMessages', 'BOQ limit not found for this item and project');
      return res.redirect('/allocateinv2');
    }
    const boqLimit = boqResult.rows[0].limit;
    if (amount > boqLimit) {
      const message2 = `BOQ ALERT! ${item_name} size ${size} for project ${project_id} has exceeded its BOQ limit.`;
      const notqs = 'INSERT INTO notifications_qs (message, read, project_id, item_name, size) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(notqs, [message2, false, project_id, item_name, size]);
      req.flash('errorMessages', 'Allocated amount exceeds BOQ limit');
      return res.redirect('/allocateinv2');
    }

    // Proceed with allocation
    const afterdeduct = availableQuantity - amount;
    if (afterdeduct < (availableQuantity * 0.75)) {
      const message = `Alert! Item ${item_name} (size ${size}) stock has depleted below 75%`;
      const notceo = 'INSERT INTO notifications (message, read) VALUES ($1, $2)';
      await pool.query(notceo, [message, false]);

      const notstore = 'INSERT INTO notifications_store (message, read) VALUES ($1, $2)';
      await pool.query(notstore, [message, false]);
    }

    // Insert the entry into allocated_inv table
    const insertQuery = 'INSERT INTO allocated_inv (item_name, Size, project_id, allocated_amount) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, [item_name, size, project_id, amount]);

    // Deduct the allocated amount from the inventory
    const updateInventoryQuery = 'UPDATE warehouse2inventory SET "Qty Required" = "Qty Required" - $1 WHERE "ITEM" = $2 AND "Size" = $3';
    await pool.query(updateInventoryQuery, [amount, item_name, size]);
    await client.query('COMMIT');
    
    req.flash('successMessage', 'Allocation successful');
    res.redirect('/allocateinv2');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    req.flash('errorMessages', 'Internal Server Error');
    res.redirect('/allocateinv2');
  }
});

app.post('/addinventory3', async (req, res) => {
  try {
    const { item, size, deno, qtyrequired, price } = req.body;

    // Validation checks
    if (!item || !size || !deno || !qtyrequired || !price) {
      req.flash('error_msg', 'All fields are required.');
      return res.redirect('/addinventory3');
    }

    if (isNaN(price)) {
      req.flash('error_msg', 'Price must be a numeric value.');
      return res.redirect('/addinventory3');
    }

    await client.query('BEGIN');

    // Insert the inventory into the database
    const insertQuery = `
      INSERT INTO public."warehouse3inventory" ("ITEM", "Size", "DENO", "Qty Required", "price")
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [item, size, deno, qtyrequired, price]);

    const recvdelQuery = `
      DELETE FROM receivings 
      WHERE date_received::date = CURRENT_DATE 
      AND warehouse_id = 3 
      AND receivings.item = $1;
    `;
    await pool.query(recvdelQuery, [item]);
    await client.query('COMMIT');

    req.flash('successMessage', 'Inventory added successfully.');
    res.redirect('/addinventory3');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding inventory:', error);
    req.flash('error_msg', 'Internal Server Error.');
    res.redirect('/addinventory3');
  }
});

app.post('/allocateinv3', async (req, res) => {
  const { project_id, item_name, size, amount } = req.body;

  // Validation checks
  if (!project_id || !item_name || !size || !amount) {
    req.flash('errorMessages', 'All fields are required.');
    return res.redirect('/allocateinv3');
  }

  if (isNaN(project_id) || !Number.isInteger(Number(project_id))) {
    req.flash('errorMessages', 'Project ID must be an integer.');
    return res.redirect('/allocateinv3');
  }

  if (isNaN(amount) || !Number.isInteger(Number(amount))) {
    req.flash('errorMessages', 'Allocated amount must be an integer.');
    return res.redirect('/allocateinv3');
  }

  try {
    await client.query('BEGIN');

    // Check if the project exists
    const projectExistsQuery = 'SELECT * FROM projects WHERE project_id = $1';
    const projectExistsResult = await pool.query(projectExistsQuery, [project_id]);
    if (projectExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Project not found');
      return res.redirect('/allocateinv3');
    }

    // Check if the item exists in inventory
    const itemExistsQuery = 'SELECT * FROM warehouse3inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const itemExistsResult = await pool.query(itemExistsQuery, [item_name, size]);
    if (itemExistsResult.rows.length === 0) {
      req.flash('errorMessages', 'Item not found in inventory');
      return res.redirect('/allocateinv3');
    }

    // Check if the allocated amount is not greater than the available quantity
    const availableQuantityQuery = 'SELECT "Qty Required" FROM warehouse3inventory WHERE "ITEM" = $1 AND "Size" = $2';
    const availableQuantityResult = await pool.query(availableQuantityQuery, [item_name, size]);
    const availableQuantity = availableQuantityResult.rows[0]["Qty Required"];
    if (amount > availableQuantity) {
      req.flash('errorMessages', 'Allocated amount exceeds available quantity');
      return res.redirect('/allocateinv3');
    }

    // Check if the allocated amount does not exceed the BOQ limit
    const boqQuery = 'SELECT "limit" FROM project_boq WHERE project_id = $1 AND item_name = $2 AND size = $3';
    const boqResult = await pool.query(boqQuery, [project_id, item_name, size]);
    if (boqResult.rows.length === 0) {
      req.flash('errorMessages', 'BOQ limit not found for this item and project');
      return res.redirect('/allocateinv3');
    }
    const boqLimit = boqResult.rows[0].limit;
    if (amount > boqLimit) {
      const message2 = `BOQ ALERT! ${item_name} size ${size} for project ${project_id} has exceeded its BOQ limit.`;
      const notqs = 'INSERT INTO notifications_qs (message, read, project_id, item_name, size) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(notqs, [message2, false, project_id, item_name, size]);
      req.flash('errorMessages', 'Allocated amount exceeds BOQ limit');
      return res.redirect('/allocateinv3');
    }

    // Proceed with allocation
    const afterdeduct = availableQuantity - amount;
    if (afterdeduct < (availableQuantity * 0.75)) {
      const message = `Alert! Item ${item_name} (size ${size}) stock has depleted below 75%`;
      const notceo = 'INSERT INTO notifications (message, read) VALUES ($1, $2)';
      await pool.query(notceo, [message, false]);

      const notstore = 'INSERT INTO notifications_store (message, read) VALUES ($1, $2)';
      await pool.query(notstore, [message, false]);
    }

    // Insert the entry into allocated_inv table
    const insertQuery = 'INSERT INTO allocated_inv (item_name, Size, project_id, allocated_amount) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, [item_name, size, project_id, amount]);

    // Deduct the allocated amount from the inventory
    const updateInventoryQuery = 'UPDATE warehouse3inventory SET "Qty Required" = "Qty Required" - $1 WHERE "ITEM" = $2 AND "Size" = $3';
    await pool.query(updateInventoryQuery, [amount, item_name, size]);
    await client.query('COMMIT');
    
    req.flash('successMessage', 'Allocation successful');
    res.redirect('/allocateinv3');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
    req.flash('errorMessages', 'Internal Server Error');
    res.redirect('/allocateinv3');
  }
});

app.post('/updateboq', async (req, res) => {
  const { project_id, item_name, size, limit } = req.body;

  try {
    await client.query('BEGIN');

      // Update the limit in the project_boq table
      const updateQuery = 'UPDATE project_boq SET "limit" = $1 WHERE project_id = $2 AND item_name = $3 AND size= $4';
      await pool.query(updateQuery, [limit, project_id, item_name, size]);
      await client.query('COMMIT');


      res.status(200).send('BOQ limit updated successfully');
  } catch (error) {
    await client.query('ROLLBACK');

      console.error('Error updating BOQ limit:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/receivinginventory.html', upload.single('image'), async (req, res) => {
  const { item_name, receiving_date, warehouse, size, quantity } = req.body;
  const image = req.file ? req.file.buffer : null;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format

  if (receiving_date < currentDate) {
    req.flash('error', 'Receiving date cannot be before the current date.');
    return res.render('receivinginventory', { errorMessage: req.flash('error') });
  }

  try {
    await client.query('BEGIN');
    const insertReceivingQuery = 'INSERT INTO receivings (date_received, item, warehouse_id, "Size", "Quantity", "PO") VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(insertReceivingQuery, [receiving_date, item_name, warehouse, size, quantity, image]);
    await client.query('COMMIT');


    req.flash('success', 'Inventory received successfully.');
    res.render('receivinginventory', { successMessage: req.flash('success') });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Error receiving inventory:', error);
    req.flash('error', 'Internal Server Error');
    res.render('receivinginventory', { errorMessage: req.flash('error') });
  }
});


app.post('/addprojects', async (req, res) => {
  const { projectName, warehouseId, projectBudget, projectDeadline, item_name, size, deno, limit } = req.body;

  // Validation
  const errors = [];
  if (isNaN(parseInt(warehouseId))) {
    errors.push('Warehouse ID must be an integer.');
  }
  if (isNaN(parseFloat(projectBudget))) {
    errors.push('Project budget must be a number.');
  }
  if (Array.isArray(limit)) {
    limit.forEach(l => {
      if (isNaN(parseInt(l))) {
        errors.push('Limit must be an integer.');
      }
    });
  } else {
    if (isNaN(parseInt(limit))) {
      errors.push('Limit must be an integer.');
    }
  }

  const currentDate = new Date();
  const deadlineDate = new Date(projectDeadline);
  if (deadlineDate < currentDate) {
    errors.push('Project deadline must not be before the current date.');
  }

  if (errors.length > 0) {
    req.flash('errorMessages', errors);
    return res.redirect('/addprojects');
  }

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Insert the new project and return the project_id
    const insertProjectQuery = `INSERT INTO projects (project_name, warehouse_id, project_budget, project_deadline) VALUES ($1, $2, $3, $4) RETURNING project_id`;
    const projectResult = await pool.query(insertProjectQuery, [projectName, warehouseId, projectBudget, projectDeadline]);
    const projectId = projectResult.rows[0].project_id;

    // Insert the BOQ entries
    if (Array.isArray(item_name)) {
      for (let i = 0; i < item_name.length; i++) {
        const insertBoqQuery = `INSERT INTO project_boq (project_id, item_name, size, deno, "limit") VALUES ($1, $2, $3, $4, $5)`;
        await pool.query(insertBoqQuery, [projectId, item_name[i], size[i], deno[i], limit[i]]);
      }
    } else {
      // Handle case when there's only one set of BOQ fields
      const insertBoqQuery = `INSERT INTO project_boq (project_id, item_name, size, deno, "limit") VALUES ($1, $2, $3, $4, $5)`;
      await pool.query(insertBoqQuery, [projectId, item_name, size, deno, limit]);
    }

    // Commit the transaction
    await pool.query('COMMIT');

    req.flash('successMessage', 'Project and BOQ entries added successfully!');
    res.redirect('/addprojects');
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error adding project:', error);
    req.flash('errorMessages', ['Error adding project']);
    res.redirect('/addprojects');
  }
});


app.post('/sharevendordetails', async (req, res) => {
  const { vendor_name, contact, cnic, project_id, works } = req.body;
  let errorMessages = [];

  // Validate inputs
  if (!vendor_name || !contact || !cnic || !project_id || !works) {
    errorMessages.push('All fields are required.');
  }
  if (cnic.length !== 13 || isNaN(cnic)) {
    errorMessages.push('CNIC should be exactly 13 numeric characters.');
  }
  if (contact.length !== 11 || isNaN(contact)) {
    errorMessages.push('Contact should be exactly 11 numeric characters.');
  }
  if (isNaN(project_id) || project_id.length !== 1) {
    errorMessages.push('Project ID should be a single digit number.');
  }

  if (errorMessages.length > 0) {
    req.flash('errorMessages', errorMessages);
    return res.redirect(`/sharevendordetails?projectId=${project_id}`);
  }

  try {
    await client.query('BEGIN');
    const query = `INSERT INTO vendors (vendor_name, contact, cnic, works_on, project_id) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [vendor_name, contact, cnic, works, project_id]);
    await client.query('COMMIT');
    req.flash('successMessage', 'Vendor Details added successfully.');
    res.redirect(`/sharevendordetails?projectId=${project_id}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding vendor details:', error);
    req.flash('errorMessages', ['Internal Server Error']);
    res.redirect(`/sharevendordetails?projectId=${project_id}`);
  }
});

app.post('/logout', (req, res) => {
  const userRole = req.session.user ? req.session.user.cnic : null;
  
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard'); // or any default page if session destruction fails
    }
    res.clearCookie('connect.sid');

    // Redirect based on the user's role
    switch (userRole) {
      case '1111111111111':
        res.redirect('/login?role=ceo');
        break;
      case '2222222222222':
        res.redirect('/login?role=qs');
        break;
      case '3333333333333':
        res.redirect('/login?role=fin');
        break;
      case '4444444444444':
        res.redirect('/login?role=store');
        break;
      case '5555555555555':
        res.redirect('/login?role=warehouse1');
        break;
      case '6666666666666':
        res.redirect('/login?role=warehouse2');
        break;
      case '7777777777777':
        res.redirect('/login?role=warehouse3');
        break;
      default:
        res.redirect('/login'); // Default login page for unknown roles
    }
  });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});