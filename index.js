const http = require('http');
const fs = require('node:fs');
const path = require('node:path');

const { ContentType } = require('./src/constants.js');

const PORT = process.env.PORT || 3050;

const server = http.createServer((req, res) => {
  const locUrl = req.url;
  switch (locUrl) {
    case '/':
      sendFile('index.html', res);
      break;
    case '/about':
      sendFile('about.html', res);
      break;
    case '/contacts':
      sendFile('contacts.html', res);
      break;
    default:
      const extname = path.extname(locUrl.slice(1, locUrl.length));
      if (extname.slice(1, extname.length) in ContentType) {
        sendFile(locUrl.slice(1, locUrl.length), res);
      } else {
        res.writeHead (404);
        res.write('Url not found');
        res.end();
      }
  }
})

const sendFile = (fileName, res) => {
  const filePath = path.join(__dirname, 'public', fileName);
  const ext = path.extname(filePath);
  const ind = ext.slice(1, ext.length);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead (404);
      res.write('File not found');
      res.end(err.message);
    } else {
      res.writeHead(200, {
        "Content-Type": ContentType[ind]
      })
      res.write(data);
      res.end();
    }
  })
}

server.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
})