export default defineEventHandler(async (event) => {

  const code = getQuery(event).code;
  console.log('Received code:', code);

  const url = 'https://oauth.shippingbo.com/oauth/token';

  const data = {
      grant_type: 'authorization_code',
      client_id: process.env.SHIPPINGBO_CLIENT_ID,
      client_secret: process.env.SHIPPINGBO_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.SHIPPINGBO_REDIRECT_URI
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Token error: ${response.status} – ${err.error_description || JSON.stringify(err)}`);
  }

  const result = await response.json();

  console.log('Access token:', result);
  // return result.access_token;
});
