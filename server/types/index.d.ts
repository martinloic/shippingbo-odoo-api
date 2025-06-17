interface OdooOrder {
  id: number;
  name: string;
  shippingbo_id: string;
}

interface ShippingboOrder {
  id: number;
  state: "dispatched" | "shipped" | "canceled" | (string & {});
}
