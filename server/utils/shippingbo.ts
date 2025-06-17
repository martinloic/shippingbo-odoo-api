export async function getShippingboOrder(orderId: string):Promise<ShippingboOrder | null> {
  const url = "https://app.shippingbo.com/orders/" + orderId;

  const headers = {
    'Content-Type' : 'application/json',
    'X-API-TOKEN' : process.env.SHIPPINGBO_USER_PASSWORD,
    'X-API-USER'  : process.env.SHIPPINGBO_USER,
    // 'X-API-USER-ID' : __YOUR_API_USER_ID__,
    'X-API-VERSION' : '1'
  };

  const response = await $fetch<ShippingboOrder>(url, {
      method: 'GET',
      headers: headers
  });

  return response;
}
