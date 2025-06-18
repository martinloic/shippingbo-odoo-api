import { getOdooOrders, updateOrderStatus } from '~/utils/odoo';
import { getShippingboOrder } from '~/utils/shippingbo';

export default defineEventHandler(async (event) => {
    const orders = await getOdooOrders();

    const updatedOrders:OdooOrder[] = [];

    let i = 0;

    for (const order of orders) {
      try {
        const shippingbo = await getShippingboOrder(order.shippingbo_id);

        if(shippingbo.order.state === 'shipped') {
          // console.log(shippingbo.order);
          await updateOrderStatus(order, 'done');
          updatedOrders.push(order);
          break;
        }
      } catch (error) {
        console.error(`Error fetching Shippingbo order for ID ${order.shippingbo_id}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      i++;
    }
    return updatedOrders;
});
