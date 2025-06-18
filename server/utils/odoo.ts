import Odoo from 'async-odoo-xmlrpc';

/**
 *
 * @returns Promise<Odoo> - Returns an instance of the Odoo client
 */
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

/**
 *
 * @returns Promise<OdooOrder[]> - Returns a list of orders from Odoo
 */
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
    ['id', 'name', 'shippingbo_id', 'state']
    // 0, 1
  ]) as OdooOrder[];

  return orders;
}

/**
 *
 * @param orderId - The ID of the order to update
 * @param status - The new status to set for the order (default is 'done')
 * @returns Promise<any> - Returns the result of the update operation
 */
export async function updateOrderStatus(order:OdooOrder, status: string = 'done') {
  const odoo = await connectToOdoo();

  const orderId = order.id;
  const tracking_url = order.shippingbo_id;

  const result = await odoo.execute_kw('stock.picking', 'write', [
    [orderId],
    {
      state: status,
      shippingbo_url_tracking: tracking_url,
    }
  ]);

  return result;
}
