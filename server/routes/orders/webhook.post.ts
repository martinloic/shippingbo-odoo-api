import { createOrderFromShippingBoWebHook } from '~/utils/odoo';

export default defineEventHandler(async (event) => {
  // console.log('');
  if (event) {
    const body = await readBody(event);
    // console.log('Request body:', body);
    const newOrder = body.object;

    if(newOrder != null) {
      console.log('New order ShippingBo ID:', newOrder);

      if(newOrder.origin != "Odoo") {
        const order = await createOrderFromShippingBoWebHook(newOrder.id);
        return order;
      } else {
        console.log('Origin is Odoo, skipping.');
      }
    } else {
      console.log('No new order found in the request body.');
    }
  }
});
