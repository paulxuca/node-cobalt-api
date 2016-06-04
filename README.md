# node-cobalt-api
Node.js wrapper for the Cobalt API (https://cobalt.qas.im/).

## Installation
```shell
npm install --save cobalt-node-wrapper
```

## Usage
Acquire an API key from https://cobalt.qas.im/.

```javascript
// Require the module
var cobaltAPI = require('cobalt-node-wrapper');

// Create new client
var cobalt = new cobaltAPI({
  API_KEY: 'YOUR_KEY_HERE'
});

// Use the API
cobalt.get('/courses', function(err, res) {
  console.log(res);
});

cobalt.get('/textbooks', function(err, res) {
  console.log(res);
});
```

## Using Parameters
In order to pass parameters, either put them directly into the URL or pass them as an object

```javascript
cobalt.get('/courses/search', {
  q: 'Computer Science',
  limit: 5
}, function(err, res) {
  console.log(res);
});

// Using the ':id' parameter is like using any other parameter.
cobalt.get('/buildings', {
  id: '005'
}, function(err, res) {
  console.log(res);
});
```

The API key is automatically passed.

## Contributing
1. Fork the repository
2. Create a new branch
3. Make changes and additions as needed
4. Push changes and make a pull request
