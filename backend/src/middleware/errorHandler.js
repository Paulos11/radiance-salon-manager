const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message;

  // SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // SQLite foreign key constraint
  if (err.message && err.message.includes('FOREIGN KEY constraint')) {
    const message = 'Cannot delete record due to existing references';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

module.exports = errorHandler;
