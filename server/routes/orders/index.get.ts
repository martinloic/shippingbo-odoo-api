import { getTodayShippingBoOrders } from '~/utils/shippingbo';
import { createOrderFromShippingBo, findOdooOrderWithShippingBo } from '~/utils/odoo';

export default defineEventHandler(async () => {
  console.log('Fetching today\'s ShippingBo orders...');
  const orders = await getTodayShippingBoOrders();

  const ordersCreated = [];

  for(const shippingboOrder of orders) {
    const findOdooOrder = await findOdooOrderWithShippingBo(shippingboOrder.id);

    if(!findOdooOrder) {
      const order = await createOrderFromShippingBo(shippingboOrder);
      if(order && Object.keys(order).length > 0) {
        ordersCreated.push(order);
      }
      // break;
    }
  }
  if(ordersCreated.length === 0) {
    return { message: 'No new orders to import today.' };
  }
  return ordersCreated;
});
