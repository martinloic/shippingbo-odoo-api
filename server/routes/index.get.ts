import { getOdooOrders, updateOrderStatus } from '~/utils/odoo';
import { getShippingboOrder } from '~/utils/shippingbo';

export default defineEventHandler(async (event) => {
    const orders = await getOdooOrders();

    for (const order of orders) {
      try {
        const shippingbo = await getShippingboOrder(order.shippingbo_id);

        if(shippingbo.state === 'shipped') {
          await updateOrderStatus(order.id, 'done');
          break;
        }
      } catch (error) {
        console.error(`Error fetching Shippingbo order for ID ${order.shippingbo_id}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return orders;
});
