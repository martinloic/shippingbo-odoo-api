export default defineEventHandler(async (event) => {
  const url = 'https://oauth.shippingbo.com/oauth/authorize';

  const searchParams = new URLSearchParams({
    response_type: 'code',
    scope: 'order',
    client_id: process.env.SHIPPINGBO_CLIENT_ID,
    redirect_uri: process.env.SHIPPINGBO_REDIRECT_URI
  });

  // Redirect to the Shippingbo authorization URL
  const redirectUrl = `${url}?${searchParams.toString()}`;
  event.node.res.writeHead(302, { Location: redirectUrl });
  event.node.res.end();
});
