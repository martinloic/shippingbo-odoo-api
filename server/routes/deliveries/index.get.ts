import { getOdooOrders, updateOrderStatus } from '~/utils/odoo';
import { getShippingboOrder } from '~/utils/shippingbo';

export default defineEventHandler(async (event) => {
    const orders = await getOdooOrders();

    const updatedOrders:OdooOrder[] = [];

    let i = 0;

    for (const order of orders) {
      try {
        const shippingbo = await getShippingboOrder(order.shippingbo_id);
        console.log(`Processing order ID: ${order.id} - ${i} / ${orders.length}`);

        const tracking_ref = shippingbo.order.shipments[0]?.tracking_url;

        if(shippingbo.order.state === 'shipped') {
          console.log(shippingbo.order.origin_ref);
          await updateOrderStatus(order, tracking_ref, 'done');
          updatedOrders.push(order);
          // break;
        }
      } catch (error) {
        console.error(`Error fetching Shippingbo order for ID ${order.shippingbo_id}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      i++;
    }
    return updatedOrders;
});
