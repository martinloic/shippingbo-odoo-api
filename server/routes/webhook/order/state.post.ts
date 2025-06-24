export default defineEventHandler(async (event) => {
  if (event) {
    const body = await readBody(event);
    const newOrderState = body.object;

    console.log(newOrderState);
  } else {
    console.log('No new order state found in the request body.');
  }
});
