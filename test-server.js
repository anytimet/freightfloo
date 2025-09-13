const http = require('http');
const { execSync } = require('child_process');

const port = process.env.PORT || 8080;
const hostname = '0.0.0.0';

console.log('Starting test server...');
console.log('PORT:', port);
console.log('Hostname:', hostname);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Setup database
console.log('Setting up database...');
try {
  execSync('pnpm prisma db push', { stdio: 'inherit' });
  console.log('Database setup completed');
} catch (error) {
  console.error('Database setup failed:', error);
  // Continue anyway, the app might still work
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from FreightFloo!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
