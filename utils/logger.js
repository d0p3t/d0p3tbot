var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      handleExceptions: true,
      json: false,
      prettyPrint: true,
      colorize: true
    }),
    new (winston.transports.File)({
      filename: './logs/logfile.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
