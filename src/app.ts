// Import required modules and dependencies
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import redis from 'redis';
import { translateMessage } from './translator';

// Create an instance of the Express application
const app = express();
const port = 3000;

// Create a Redis client
const redisClient = redis.createClient();

// Set up middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to log sender and receiver information
app.use((req: Request, res: Response, next) => {
  const sender = req.header('x-sender');
  const receiver = req.header('x-receiver');
  console.log(`Sender: ${sender}, Receiver: ${receiver}`);
  next();
});

// Store the translation maps in Redis (this might happen during server startup or updates)
const earthMarsTranslationMap = {
  'a': '2', 'b': '22', 'c': '222',
  'd': '3', 'e': '33', 'f': '333',
  'g': '4', 'h': '44', 'i': '444',
  'j': '5', 'k': '55', 'l': '555',
  'm': '6', 'n': '66', 'o': '666',
  'p': '7', 'q': '77', 'r': '777', 's': '7777',
  't': '8', 'u': '88', 'v': '888',
  'w': '9', 'x': '99', 'y': '999', 'z': '9999',
  '111': '?'
};
const marsEarthTranslationMap = {
  '2': 'a', '22': 'b', '222': 'c',
  '3': 'd', '33': 'e', '333': 'f',
  '4': 'g', '44': 'h', '444': 'i',
  '5': 'j', '55': 'k', '555': 'l',
  '6': 'm', '66': 'n', '666': 'o',
  '7': 'p', '77': 'q', '777': 'r', '7777': 's',
  '8': 't', '88': 'u', '888': 'v',
  '9': 'w', '99': 'x', '999': 'y', '9999': 'z',
  '0':'','.': ''+''
};

const earthMarsTranslationMapJSON = JSON.stringify(earthMarsTranslationMap);
const marsEarthTranslationMapJSON = JSON.stringify(marsEarthTranslationMap);

redisClient.set('translation-map-earth-mars', earthMarsTranslationMapJSON);
redisClient.set('translation-map-mars-earth', marsEarthTranslationMapJSON);

// Handle POST requests to /api/earth-mars-comm/message
app.post('/api/earth-mars-comm/message', (req: Request, res: Response) => {
  // Extract message, sender, and receiver from the request
  const message = req.body.message;
  const sender = req.header('x-sender');
  const receiver = req.header('x-receiver');
  
  // Translate the message using the translator module
  const translatedMessage = translateMessage(message, sender ?? '', receiver ?? '');
  
  // Respond with translated message and a response based on the sender
  res.json({
    'Nokia Translation': translatedMessage,
    'Response from Mars': sender === 'earth' ? 'Response from Mars' : 'Response from Earth'
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});