const express = require('express');
require('dotenv').config();
const http = require('http');
const db = require('./DB/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const userroutes = require('./Routes/authRoutes');
const logger = require('./logger/logger');
const socketHandler = require('./socketHandling');
const promClient = require('prom-client');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});
const port = 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Prometheus metrics
const promRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: promRegistry });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['route', 'method'],
  registers: [promRegistry]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'method', 'status'],
  registers: [promRegistry]
});


app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  const route = req.originalUrl || req.url; 
  res.on('finish', () => {
    end({ route: route, method: req.method });
    httpRequestTotal.labels(route, req.method, res.statusCode).inc();
  });
  next();
});

app.use(userroutes);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promRegistry.contentType);
    res.end(await promRegistry.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Socket handling
socketHandler(io, logger);

// Start server
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
