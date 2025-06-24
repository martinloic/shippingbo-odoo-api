import { updateOrderStatus } from '~/utils/odoo';

export default defineEventHandler(async (event) => {
  console.log('Processing new order state from webhook...');
  if (event) {
    console.log('Event received:', event);
    const body = await readBody(event);
    const newOrderState = body.object;

    if(newOrderState != null) {
      if(newOrderState.state === 'shipped') {
        const updatedOrder = await updateOrderStatus(newOrderState.id, newOrderState.tracking_url, 'done');
        return updatedOrder;
      }
    }
    console.log(newOrderState);
  } else {
    console.log('No new order state found in the request body.');
  }
});
