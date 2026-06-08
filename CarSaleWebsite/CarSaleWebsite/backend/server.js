const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const FRONTEND_PATH = path.join(__dirname, '..');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-id',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 15 * 1024 * 1024) reject(new Error('Request body too large.'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid JSON body.')); }
    });
  });
}

function getAuthenticatedUser(req) {
  const userId = Number(req.headers['x-user-id']);
  const db = readDb();
  const user = db.users.find(u => Number(u.id) === userId);
  return { user, db };
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.json': 'application/json'
  };
  return types[ext] || 'application/octet-stream';
}

function serveStatic(req, res, pathname) {
  if (pathname === '/') pathname = '/html/index.html';
  const safePath = path.normalize(pathname).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(FRONTEND_PATH, safePath);
  if (!filePath.startsWith(FRONTEND_PATH)) return sendJson(res, 403, { message: 'Forbidden.' });

  fs.readFile(filePath, (err, data) => {
    if (err) return sendJson(res, 404, { message: 'File not found.' });
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
  });
}

async function handleApi(req, res, pathname, query) {
  if (req.method === 'OPTIONS') return sendJson(res, 200, {});

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, { status: 'ok', project: 'AutoDrive', backend: 'Node.js' });
    }

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await readBody(req);
      const { fullName, email, password } = body;
      if (!fullName || !email || !password) return sendJson(res, 400, { message: 'Full name, email and password are required.' });
      if (String(password).length < 8) return sendJson(res, 400, { message: 'Password must be at least 8 characters.' });

      const db = readDb();
      const normalizedEmail = String(email).trim().toLowerCase();
      if (db.users.some(u => u.email === normalizedEmail)) return sendJson(res, 409, { message: 'This email is already registered.' });

      const user = { id: Date.now(), fullName: String(fullName).trim(), email: normalizedEmail, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
      db.users.push(user);
      writeDb(db);
      return sendJson(res, 201, { user: publicUser(user) });
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req);
      const db = readDb();
      const normalizedEmail = String(body.email || '').trim().toLowerCase();
      const user = db.users.find(u => u.email === normalizedEmail && u.passwordHash === hashPassword(body.password || ''));
      if (!user) return sendJson(res, 401, { message: 'Invalid email or password.' });
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (req.method === 'GET' && pathname === '/api/cars') {
      const db = readDb();
      let cars = db.cars;
      if (query.ownerId) cars = cars.filter(car => Number(car.ownerId) === Number(query.ownerId));
      return sendJson(res, 200, cars);
    }

    const carIdMatch = pathname.match(/^\/api\/cars\/(\d+)$/);
    if (carIdMatch && req.method === 'GET') {
      const db = readDb();
      const car = db.cars.find(c => Number(c.id) === Number(carIdMatch[1]));
      if (!car) return sendJson(res, 404, { message: 'Car not found.' });
      return sendJson(res, 200, car);
    }

    if (req.method === 'POST' && pathname === '/api/cars') {
      const { user, db } = getAuthenticatedUser(req);
      if (!user) return sendJson(res, 401, { message: 'Authentication required.' });
      const body = await readBody(req);
      if (!body.brand || !body.model || !body.year || !body.price) return sendJson(res, 400, { message: 'Brand, model, year and price are required.' });

      const car = {
        id: Date.now(), ownerId: user.id, ownerEmail: user.email, ownerName: user.fullName,
        brand: body.brand, model: body.model, type: body.type, year: Number(body.year), price: Number(body.price), mileage: Number(body.mileage),
        fuel: body.fuel, transmission: body.transmission, color: body.color, horsepower: Number(body.horsepower) || 0,
        engineSize: Number(body.engineSize) || 0, drive: body.drive || 'FWD', consumption: Number(body.consumption) || 0,
        doors: Number(body.doors) || 4, seats: Number(body.seats) || 5, location: body.location || '', inspection: Boolean(body.inspection),
        image: body.image || '../assets/images/cars/bmw1.png', images: Array.isArray(body.images) && body.images.length ? body.images : ['../assets/images/cars/bmw1.png'],
        features: Array.isArray(body.features) ? body.features : [], description: body.description || 'User added listing.', createdAt: new Date().toISOString(), updatedAt: null
      };
      db.cars.unshift(car);
      writeDb(db);
      return sendJson(res, 201, car);
    }

    if (carIdMatch && req.method === 'PUT') {
      const { user, db } = getAuthenticatedUser(req);
      if (!user) return sendJson(res, 401, { message: 'Authentication required.' });
      const index = db.cars.findIndex(c => Number(c.id) === Number(carIdMatch[1]));
      if (index === -1) return sendJson(res, 404, { message: 'Car not found.' });
      if (Number(db.cars[index].ownerId) !== Number(user.id)) return sendJson(res, 403, { message: 'You can only edit your own listings.' });
      const body = await readBody(req);
      db.cars[index] = { ...db.cars[index], ...body, ownerId: user.id, ownerEmail: user.email, ownerName: user.fullName, updatedAt: new Date().toISOString() };
      writeDb(db);
      return sendJson(res, 200, db.cars[index]);
    }

    if (carIdMatch && req.method === 'DELETE') {
      const { user, db } = getAuthenticatedUser(req);
      if (!user) return sendJson(res, 401, { message: 'Authentication required.' });
      const car = db.cars.find(c => Number(c.id) === Number(carIdMatch[1]));
      if (!car) return sendJson(res, 404, { message: 'Car not found.' });
      if (Number(car.ownerId) !== Number(user.id)) return sendJson(res, 403, { message: 'You can only delete your own listings.' });
      db.cars = db.cars.filter(c => Number(c.id) !== Number(carIdMatch[1]));
      writeDb(db);
      return sendJson(res, 200, { message: 'Listing deleted successfully.' });
    }

    const dashMatch = pathname.match(/^\/api\/dashboard\/(\d+)$/);
    if (dashMatch && req.method === 'GET') {
      const db = readDb();
      const listings = db.cars.filter(c => Number(c.ownerId) === Number(dashMatch[1]));
      const totalValue = listings.reduce((sum, car) => sum + Number(car.price || 0), 0);
      return sendJson(res, 200, {
        totalListings: listings.length,
        totalValue,
        averagePrice: listings.length ? Math.round(totalValue / listings.length) : 0,
        latestCar: listings[0] || null,
        recentListings: listings.slice(0, 3)
      });
    }

    return sendJson(res, 404, { message: 'API route not found.' });
  } catch (error) {
    return sendJson(res, 500, { message: error.message || 'Server error.' });
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname, parsedUrl.query);
  } else {
    serveStatic(req, res, pathname);
  }
});

server.listen(PORT, () => {
  console.log(`AutoDrive backend is running on http://localhost:${PORT}`);
  console.log(`Open the website at http://localhost:${PORT}/html/index.html`);
  console.log('Demo account: demo@autodrive.com / Password123');
});
