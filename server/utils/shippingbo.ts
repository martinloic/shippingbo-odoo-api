import { startOfDay, endOfDay, formatISO, subHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const headers = {
  'Content-Type' : 'application/json',
  'X-API-TOKEN' : process.env.SHIPPINGBO_USER_PASSWORD,
  'X-API-USER'  : process.env.SHIPPINGBO_USER,
  'X-API-VERSION' : '1'
};

export async function getShippingboOrder(orderId: string):Promise<ShippingBoOrder | null> {
  const url = "https://app.shippingbo.com/orders/" + orderId;

  const response = await $fetch<{order:ShippingBoOrder}>(url, {
      method: 'GET',
      headers: headers
  });

  return response.order;
}

export async function getTodayShippingBoOrders():Promise<ShippingBoOrder[] | null> {
  const url = "https://app.shippingbo.com/orders";

  // Calculate the start and end of the day in UTC
  const today = new Date();
  const timeZone = 'UTC';

  const todayStartOfDay = formatISO(startOfDay(today), { representation: 'complete' });
  const todayEndOfDay = formatISO(endOfDay(today), { representation: 'complete' });

  console.log(`Fetching orders from ${todayStartOfDay} to ${todayEndOfDay}`);

  let allRecords: ShippingBoOrder[] = [];
  let limit = 50;
  let offset = 0;
  let hasMoreRecords = true;

  try {
    while(hasMoreRecords) {
      const response = await $fetch<{ orders: ShippingBoOrder[] }>(url, {
          method: 'GET',
          headers: headers,
          params: {
            'limit': limit.toString(),
            'offset': offset.toString(),
            'sort[created_at]': 'asc',
            'search[created_at__gt]': todayStartOfDay,
            'search[created_at__lt]': todayEndOfDay,
            'search[origin__neq]': 'Odoo',
          }
      });

      allRecords = allRecords.concat(response.orders);

      if(response.orders && response.orders.length === limit) {
        offset += limit;
      } else {
        hasMoreRecords = false;
      }
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }

  console.log(`Fetched ${allRecords.length} orders for today.`);
  return allRecords;
}
