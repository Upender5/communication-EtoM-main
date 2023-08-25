import redis from 'redis';

// Create a Redis client
const redisClient = redis.createClient();

// Function to translate a message based on sender and receiver
export function translateMessage(message: string, sender: string, receiver: string): string {
  
  if (sender === 'earth' && receiver === 'mars') {
    return translateEarthToMars(message);
  } else if (sender === 'mars' && receiver === 'earth') {
    return translateMarsToEarth(message);
  } else {
    return 'Invalid sender or receiver.';
  }
}

// Function to translate Earth text to Mars code
function translateEarthToMars(message: string): string {
  
  const translationMap: { [key: string]: string } = {
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

  // Translate the message using the translationMap
  const translation = message
    .toLowerCase()
    .split('')
    .map(char => translationMap[char] || char)
    .join('');

  return translation;
}

// Function to translate Mars code back to Earth text
function translateMarsToEarth(message: string): string {
  const reverseTranslationMap: { [key: string]: string } = {
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

  let result = '';
  let currentGroup = '';

  // Iterate through the message and translate numeric groups
  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    if (currentGroup === '' || currentGroup[0] === char) {
      currentGroup += char;
    } else {
      result += translateGroup(currentGroup, reverseTranslationMap);
      currentGroup = char;
    }
  }

  if (currentGroup) {
    result += translateGroup(currentGroup, reverseTranslationMap);
  }

  // Print the result for debugging (you might want to remove this line)
  console.log(result);

  return result;
}

// Function to translate a numeric group back to Earth text
function translateGroup(group: string, map: { [key: string]: string }): string {
  // Reverse the group for reverse lookup in the map
  const reversedGroup = group.split('').reverse().join('');

  // Look up the numeric sequence in the reverse translation map
  const numericSequence = map[reversedGroup];

  if (numericSequence) {
    return numericSequence;
  }

  // Handle longer numeric groups by breaking them down recursively
  // ...

  // Handle 2-character numeric groups
  // ...

  // Handle single characters
  let translated = '';
  for (let i = 0; i < group.length; i++) {
    const char = group[i];
    translated += map[char] || char;
  }

  return translated;
}
