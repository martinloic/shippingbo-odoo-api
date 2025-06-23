export default defineEventHandler(async (event) => {
  console.log('');

  console.log(event);

  if (event) {
    const body = await readBody(event);
    console.log('Request body:', body);
  }
});
