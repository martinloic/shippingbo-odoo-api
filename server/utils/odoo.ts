import OdooJSONRpc, { isCredentialsResponse } from '@fernandoslim/odoo-jsonrpc';

export async function connectToOdoo() {
    //@ts-ignore-next-line
    const odoo = new OdooJSONRpc.default({
    baseUrl: process.env.ODOO_URL,
    port: Number(process.env.ODOO_PORT) || 443,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    apiKey: process.env.ODOO_PASSWORD
  });

  await odoo.connect();

  return odoo;
}

/**
 *
 * @returns Promise<OdooOrder[]> - Returns a list of orders from Odoo
 */
export async function getOdooOrders() {
  const odoo = await connectToOdoo();

  const orders = await odoo.searchRead('stock.picking', [
    '|',
    ['state', '=', 'confirmed'],
    ['state', '=', 'assigned'],
    '&',
    ['name', 'ilike', 'QF/OUT/'],
    ['shippingbo_id', '!=', false]
  ], ['id', 'name', 'shippingbo_id', 'state']) as OdooOrder[];

  return orders;
}

/**
 *
 * @param orderId - The ID of the order to update
 * @param status - The new status to set for the order (default is 'done')
 * @returns Promise<any> - Returns the result of the update operation
 */
export async function updateOrderStatus(order:OdooOrder, tracking_ref: string, status: string = 'done') {
  const odoo = await connectToOdoo();

  const orderId = order.id;
  console.log('Updating order status for order ID:', orderId, 'with tracking ref:', tracking_ref);
  const result = await odoo.update('stock.picking', orderId, {
    shippingbo_url_tracking: tracking_ref
  });

  const assignResult = await odoo.action('stock.picking', 'action_assign', [orderId]);

  console.log('Assign result:', assignResult);

  await odoo.action('stock.picking', 'button_validate', [orderId]);

  return result;
}


export async function findOdooOrderWithShippingBo(shippingboId: number): Promise<boolean> {
  const odoo = await connectToOdoo();

  const orderList = await odoo.searchRead('stock.picking', [
    ['shippingbo_id', '=', shippingboId]
  ], ['id', 'origin', 'sale_id']);

  if( orderList.length === 0) {
    console.log('No order found with ShippingBo ID:', shippingboId);
    return false;
  }
  console.log(`Order found with ShippingBo ID: ${shippingboId} - ${orderList[0].sale_id[1]}`);
  return true;
}

export async function createOrderFromShippingBo(shippingboOrder:ShippingBoOrder):Promise <OdooOrder | null> {
  const odoo = await connectToOdoo();

  const orderList = await odoo.call_kw('shippingbo.import.order', 'web_save', [
    [],
    { order_ids_text: shippingboOrder.id }
  ], {
    specification: {
      order_ids_text: {}
    }
  });

  console.log(orderList);

  await odoo.call_kw('shippingbo.import.order', 'action_import_orders', [
    [orderList[0].id]
  ]);

  const createdOrder = await odoo.searchRead('stock.picking', [
    ['shippingbo_id', '=', shippingboOrder.id]],
    ['id', 'origin', 'sale_id'],
  );

  console.log('Created order:', createdOrder);

  if(createdOrder.length > 0) {
    await odoo.update('sale.order', createdOrder[0].sale_id[0], {
      user_id: 1
    });
  }

  return createdOrder || null;
}

export async function createOrderFromShippingBoWebHook(id:number, origin_ref:string):Promise <OdooOrder | null> {
  const odoo = await connectToOdoo();

  const orderList = await odoo.call_kw('shippingbo.import.order', 'web_save', [
    [],
    { order_ids_text: id }
  ], {
    specification: {
      order_ids_text: {}
    }
  });

  await odoo.call_kw('shippingbo.import.order', 'action_import_orders', [
    [orderList[0].id]
  ]);

  const createdOrder = await odoo.searchRead('stock.picking', [
    ['shippingbo_id', '=', id]],
    ['id', 'origin', 'sale_id']
  );

  if(createdOrder.length === 0) {
    const searchOrder = await odoo.searchRead('stock.picking', [
      ['origin', 'like', origin_ref]],
      ['id', 'name', 'sale_id']
    );

    if(searchOrder.length === 0) {
      console.log('No order found with ShippingBo ID:', id);
      return null;
    }

    await odoo.update('stock.picking', searchOrder[0].id, {
      shippingbo_id: id,
      shippingbo_is_exported: true
    });

    await odoo.update('sale.order', searchOrder[0].sale_id[0], {
      user_id: 1
    });

    console.log('Created order from search:', searchOrder);

    return searchOrder || null
  }

  if(createdOrder.length > 0) {
    await odoo.update('sale.order', createdOrder[0].sale_id[0], {
      user_id: 1
    });
  }

  console.log('Created order:', createdOrder);

  return createdOrder || null;
}
