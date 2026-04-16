export function errorHandler(error, _req, res, _next) {
  void _next;
  console.error(error);

  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error',
  });
}
