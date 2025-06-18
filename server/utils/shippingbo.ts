export async function getShippingboOrder(orderId: string):Promise<ShippingBoOrder | null> {
  const url = "https://app.shippingbo.com/orders/" + orderId;

  const headers = {
    'Content-Type' : 'application/json',
    'X-API-TOKEN' : process.env.SHIPPINGBO_USER_PASSWORD,
    'X-API-USER'  : process.env.SHIPPINGBO_USER,
    // 'X-API-USER-ID' : __YOUR_API_USER_ID__,
    'X-API-VERSION' : '1'
  };

  const response = await $fetch<ShippingBoOrder>(url, {
      method: 'GET',
      headers: headers
  });

  return response;
}


export async function getTodayShippingBoOrders():Promise<ShippingBoOrder[] | null> {
  const url = "https://app.shippingbo.com/orders";
  // const url = "https://app.shippingbo.com/orders?limit=1&sort[created_at]=desc&search[state__eq][2025-06-18]";

  const headers = {
    'Content-Type' : 'application/json',
    'X-API-TOKEN' : process.env.SHIPPINGBO_USER_PASSWORD,
    'X-API-USER'  : process.env.SHIPPINGBO_USER,
    // 'X-API-USER-ID' : __YOUR_API_USER_ID__,
    'X-API-VERSION' : '1'
  };

  // Calculate the start and end of the day in UTC
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day in local time

    // Convert to UTC and adjust for the timezone offset
  const startOfDayUTC = new Date(today.getTime() - (today.getTimezoneOffset() * 60000) - 2 * 60 * 60 * 1000).toISOString();

  const endOfDayUTC = new Date(today);
  endOfDayUTC.setHours(23, 59, 59, 999); // Set to the end of the day in local time
  const endOfDayUTCAdjusted = new Date(endOfDayUTC.getTime() - (endOfDayUTC.getTimezoneOffset() * 60000) - 2 * 60 * 60 * 1000).toISOString();

  let allRecords: ShippingBoOrder[] = [];
  let limit = 50;
  let offset = 0;
  let hasMoreRecords = true;

  try {
    while(hasMoreRecords) {
      console.log(`Fetching records with limit ${limit} and offset ${offset}`);
      const response = await $fetch<{ orders: ShippingBoOrder[] }>(url, {
          method: 'GET',
          headers: headers,
          params: {
            'limit': limit.toString(),
            'offset': offset.toString(),
            'sort[created_at]': 'asc',
            'search[created_at__gt]': startOfDayUTC,
            'search[created_at__lt]': endOfDayUTCAdjusted,
          }
      });

      console.log(`Fetched ${response.orders.length} records`);

      if(response.orders && response.orders.length > 0) {
        allRecords = allRecords.concat(response.orders);
        offset += limit;
      } else {
        hasMoreRecords = false;
      }
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }

  return allRecords;
}
