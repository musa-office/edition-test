// ============================================================
//  Customer Account API — GraphQL operations & result types
// ============================================================

/** Customer profile + most recent orders, in a single round-trip. */
export const CUSTOMER_OVERVIEW_QUERY = /* GraphQL */ `
  query CustomerOverview($first: Int!) {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: { amount: string; currencyCode: string } | null;
}

export interface CustomerOverview {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
    orders: { nodes: CustomerOrder[] };
  } | null;
}

/** A single order with its line items + money breakdown, for the detail page. */
export const ORDER_DETAIL_QUERY = /* GraphQL */ `
  query OrderDetail($id: ID!) {
    order(id: $id) {
      id
      name
      processedAt
      financialStatus
      totalPrice { amount currencyCode }
      subtotal { amount currencyCode }
      totalShipping { amount currencyCode }
      totalTax { amount currencyCode }
      lineItems(first: 100) {
        nodes {
          id
          title
          quantity
          variantTitle
          image { url altText }
          totalPrice { amount currencyCode }
        }
      }
    }
  }
`;

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  variantTitle: string | null;
  image: { url: string; altText: string | null } | null;
  totalPrice: Money | null;
}

export interface OrderDetail {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  totalPrice: Money | null;
  subtotal: Money | null;
  totalShipping: Money | null;
  totalTax: Money | null;
  lineItems: { nodes: OrderLineItem[] };
}

export interface OrderDetailResult {
  order: OrderDetail | null;
}
