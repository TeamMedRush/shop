# MedRush Shop

Customer-facing medicine shopping frontend for the MedRush platform. This app uses the existing portable Preact template and works with the current MedRush auth, catalog, and user order APIs.

## Setup

```bash
cd portable
npm install
npm run dev
```

Build for production:

```bash
cd portable
npm run build
```

## Environment Variables

- `API_BASE_URL`: Backend base URL. Default: `http://localhost:8000`
- `API_TIMEOUT_MS`: Request timeout in milliseconds. Default: `10000`
- `API_AUTH_HEADER`: Auth header key expected by the backend. Default: `token`
- `ENABLE_MOCK_DATA`: Set to `true` or `1` to allow small catalog fallbacks if the backend is unavailable

## Available Routes

- `/`
- `/login`
- `/register`
- `/products`
- `/products/:id`
- `/cart`
- `/checkout`
- `/orders`
- `/orders/:id`
- `/profile`

## Features Implemented

- Customer login, registration, logout, and local session persistence
- Product browsing backed by `GET /api/v1/medicines`
- Local search and filtering because the backend does not parse query strings
- Product detail view built from cached catalog data because no single-product endpoint exists
- Local cart with add, update, remove, quantity totals, and localStorage persistence
- Checkout flow that updates the user account and places orders through `POST /api/v1/user/order`
- Order history backed by `GET /api/v1/user/order`
- Order detail view built from cached order history data because no single-order endpoint exists
- Customer profile update flow backed by `PATCH /api/v1/user/account`
- Loading, empty, and error states across storefront flows

## Known Limitations

- No cart API exists yet, so the cart is fully local until checkout
- No single medicine or single order endpoint exists, so detail pages depend on cached list data
- No payment, cancellation, reorder, or delivery-tracking backend endpoints exist yet
- Partner assignment data is limited in the current public catalog and order payloads
- Browser requests can fail if backend CORS is not enabled for the frontend origin

## Backend Endpoint Assumptions

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`
- `POST|PATCH|PUT /api/v1/user/account`
- `POST|GET /api/v1/user/order`
- `GET /api/v1/medicines`
