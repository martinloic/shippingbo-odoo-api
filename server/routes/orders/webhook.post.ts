export default defineEventHandler(async (event) => {
  console.log('Fetching today\'s ShippingBo orders...');

  if (event.body) {
    const body = await readBody(event);
    console.log('Request body:', body);
  }
});
