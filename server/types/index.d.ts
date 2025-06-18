interface OdooOrder {
  id: number;
  name: string;
  shippingbo_id: string;
}

interface ShippingBoOrder {
  order: {
    id: number;
    state: "dispatched" | "shipped" | "canceled" | (string & {});
    shipments: Shipments[];
    origin_ref: string;
  }
}

interface Shipments {
  tracking_url?: string;
  total_weight?: number;
}
