export default defineEventHandler((event) => {
  console.log('Auth middleware triggered');
  if(!process.env.AUTH_TOKEN) {
    console.error('AUTH_TOKEN is not set in environment variables');
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
  const headers = getHeaders(event);
  const authHeader = headers['x-api-key'];
  if (!authHeader || authHeader !== process.env.AUTH_TOKEN) {
    setResponseStatus(event, 401);
    return { error: 'Unauthorized' };
  }
});
