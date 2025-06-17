import Odoo from 'async-odoo-xmlrpc';

export async function connectToOdoo() {
  const odoo = new Odoo({
    url: process.env.ODOO_URL,
    port: process.env.ODOO_PORT || 443,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD
  });

  try {
    await odoo.connect();
    console.log('Connected to Odoo');
    return odoo;
  } catch (error) {
    console.error('Failed to connect to Odoo:', error);
    throw error;
  }
}

export async function getOdooOrders() {
const odoo = await connectToOdoo();
  const orders = await odoo.execute_kw('stock.picking', 'search_read', [
    [
      '|',
      ['state', '=', 'confirmed'],
      ['state', '=', 'assigned'],
      '&',
      ['name', 'ilike', 'QF/OUT/'],
      ['shippingbo_id', '!=', false]
    ],
    ['id', 'name', 'shippingbo_id', 'state'],
    0, 1
  ]) as OdooOrder[];

  return orders;
}

export async function updateOrderStatus(orderId: number, status: string = 'done') {
  const odoo = await connectToOdoo();

  const result = await odoo.execute_kw('stock.picking', 'write', [
    [orderId],
    {
      state: status
    }
  ]);

  return result;
}
