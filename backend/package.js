{
  "name": "backend-mariage",
  "version": "1.0.0",
  "description": "Backend pour le site de mariage de Marie et Pierre",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "wedding",
    "rsvp",
    "nodejs",
    "express"
  ],
  "author": "TIANE D",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "googleapis": "^120.0.0",
    "jsonwebtoken": "^9.0.0",
    "nodemailer": "^6.9.1",
    "qrcode": "^1.5.1",
    "sequelize": "^6.32.1",
    "sqlite3": "^5.1.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
