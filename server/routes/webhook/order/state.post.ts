export default defineEventHandler(async (event) => {
  console.log('Processing new order state from webhook...');
  if (event) {
    console.log('Event received:', event);
    const body = await readBody(event);
    const newOrderState = body.object;

    console.log(newOrderState);
  } else {
    console.log('No new order state found in the request body.');
  }
});
