export default defineEventHandler(async (event) => {
  // console.log('');
  if (event) {
    const body = await readBody(event);
    // console.log('Request body:', body);
    const newOrder = body.object.id;

    console.log('New order ID:', newOrder);
  }
});
