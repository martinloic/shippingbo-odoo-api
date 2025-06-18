interface OdooOrder {
  id: number;
  name: string;
  shippingbo_id: string;
}

interface ShippingboOrder {
  order: {
    id: number;
    state: "dispatched" | "shipped" | "canceled" | (string & {});
    shipments: Shipments[];
  }
}

interface Shipments {
  tracking_url?: string;
  total_weight?: number;
}
