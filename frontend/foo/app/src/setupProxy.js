const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const backendUrl = process.env.BACKEND_URL || 'http://172.17.47.94:8082';
  app.use(
    "/users",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );
  
  app.use(
    "/rooms",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );

  app.use(
    "/desks",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );

  app.use(
    "/bookings",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );
};
