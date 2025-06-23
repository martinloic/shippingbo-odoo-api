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
        const order = await createOrderFromShippingBoWebHook(newOrder.id, newOrder.origin_ref);
        return order;
      } else {
        console.log(`${newOrder.origin_ref} - Origin is Odoo. No action taken.`);
      }
    } else {
      console.log('No new order found in the request body.');
    }
  }
});
