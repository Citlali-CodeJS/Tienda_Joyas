
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(path.join(__dirname, 'reports.log'), log, err => {
    if (err) console.error('Error escribiendo reporte:', err);
  });
  next();
};
