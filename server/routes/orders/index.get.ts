import { getTodayShippingBoOrders } from '~/utils/shippingbo';

export default defineEventHandler(async () => {
  console.log('Fetching today\'s ShippingBo orders...');
    const orders = await getTodayShippingBoOrders();

    return orders;
});
