# Eventify Complete Implementation Guide
## PostgreSQL + Node.js + React

---

## 📁 Files Created

### Database
- `backend/database-schema-complete.sql` - Complete PostgreSQL schema with all tables

### Backend API
- `backend/src/routes/index.js` - Main API router
- Existing controllers enhanced with real-world features

### Frontend Services
- `src/services/apiService.js` - Complete API service layer

---

## 🗄️ Database Schema Overview

### Core Tables (All Roles)
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | Authentication & profiles | UUID PK, role-based, soft delete, 2FA support |
| `user_profiles` | Extended user info | Address, preferences, notifications |
| `user_sessions` | Security tracking | Token management, device tracking |
| `categories` | Event categories | Hierarchical (parent-child) |
| `venues` | Event locations | GPS coordinates, capacity, facilities |

### Organizer Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `organizer_applications` | Onboarding workflow | Multi-step approval process |
| `organizer_profiles` | Business details | Commission rates, payout settings |
| `payouts` | Revenue distribution | Period-based payouts, tax handling |

### Event Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `events` | Event listings | SEO fields, status workflow, analytics |
| `event_schedule` | Multi-day events | Day-by-day breakdown |
| `event_speakers` | Speaker/artist info | Social links, bios |
| `event_tags` | Categorization | Many-to-many tagging |
| `announcements` | Organizer updates | Important notifications |

### Booking & Payment Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `bookings` | Orders | Reference numbers, status tracking |
| `booking_items` | Individual tickets | Per-ticket attendee details |
| `payments` | Transactions | Multi-gateway support, retry tracking |
| `refunds` | Refund processing | Status tracking, reason codes |
| `ticket_types` | Pricing tiers | Early bird, group discounts |
| `ticket_inventory` | Availability | Optimistic locking for race conditions |
| `promo_codes` | Discounts | Usage limits, applicability rules |
| `cart_items` | Temporary holds | Expiry-based reservation |

### Engagement Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `reviews` | Ratings & feedback | Multi-dimensional rating, moderation |
| `wishlists` | Saved events | Reminder settings |
| `event_views` | Analytics | User agent, referrer tracking |

### System Tables
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `notifications` | User alerts | Multi-channel (email, push, SMS) |
| `activity_logs` | Audit trail | GDPR compliant action tracking |
| `system_settings` | Configuration | Dynamic settings without deploy |
| `contact_messages` | Support tickets | Status workflow |
| `newsletter_subscribers` | Marketing | Preference management |

---

## 🔌 API Endpoints Reference

### Authentication
```javascript
// Register
POST /api/auth/register
{ name, email, password, role }

// Login
POST /api/auth/login
{ email, password }

// Profile
GET    /api/auth/profile
PUT    /api/auth/profile
POST   /api/auth/avatar  // multipart/form-data

// Password
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
```

### Events (Public)
```javascript
// Browse
GET /api/events                    // List all
GET /api/events?category=tech      // Filter by category
GET /api/events?city=Mumbai         // Filter by location
GET /api/events?date=2024-12-25   // Filter by date

// Details
GET /api/events/:id
GET /api/events/slug/:slug         // SEO-friendly

// Search
POST /api/events/search
{ query: "conference", filters: { category: "tech", price: "free" } }

// Categories
GET /api/events/categories
GET /api/events/tags
```

### Tickets
```javascript
// Get tickets for event
GET /api/events/:id/tickets

// Check availability
GET /api/events/:id/availability

// Validate promo code
POST /api/events/:id/promo/validate
{ code: "SUMMER20" }
```

### Bookings (Authenticated)
```javascript
// Create booking
POST /api/bookings
{
  eventId: "uuid",
  ticketTypeId: "uuid",
  quantity: 2,
  promoCode: "SUMMER20",
  attendeeDetails: [
    { name: "John Doe", email: "john@example.com" }
  ]
}

// Get booking
GET /api/bookings/:id
GET /api/bookings/reference/BOOK-123456

// List my bookings
GET /api/bookings?status=confirmed&page=1&limit=10

// Cancel
POST /api/bookings/:id/cancel
{ reason: "Change of plans" }

// Download ticket
GET /api/bookings/:id/ticket
```

### Payments (Authenticated)
```javascript
// Initialize payment
POST /api/payments/initialize
{ bookingId: "uuid" }

// Process payment (after gateway callback)
POST /api/payments/process
{
  bookingId: "uuid",
  paymentMethod: "card",
  gatewayResponse: { ... }
}

// Verify payment
POST /api/payments/verify
{ transactionId: "...", signature: "..." }

// List payments
GET /api/payments

// Request refund
POST /api/payments/:id/refund
{ reason: "Event cancelled", amount: 99.00 }

// Get invoice
GET /api/payments/:id/invoice
```

### Cart (Authenticated)
```javascript
// Get cart
GET /api/cart

// Add item
POST /api/cart
{ ticketTypeId: "uuid", quantity: 2 }

// Update quantity
PUT /api/cart/:itemId
{ quantity: 3 }

// Remove item
DELETE /api/cart/:itemId

// Clear cart
DELETE /api/cart

// Apply promo
POST /api/cart/promo
{ code: "SUMMER20" }
```

### Wishlist (Authenticated)
```javascript
GET    /api/wishlist
POST   /api/wishlist           // Add
DELETE /api/wishlist/:eventId  // Remove
GET    /api/wishlist/check/:eventId
```

### Reviews (Authenticated)
```javascript
// Get event reviews
GET /api/events/:id/reviews?sort=rating&order=desc

// Create review (after attending)
POST /api/events/:id/reviews
{
  overallRating: 5,
  valueRating: 4,
  venueRating: 5,
  organizationRating: 5,
  title: "Amazing experience!",
  comment: "The event was well organized...",
  photos: ["url1", "url2"]
}

// Mark helpful
POST /api/reviews/:id/helpful
```

### Organizer Routes
```javascript
// Apply
POST /api/organizer/apply
{
  organizationName: "Tech Events Inc",
  businessType: "company",
  contactEmail: "...",
  address: "...",
  documents: { idProof, addressProof }
}

// Dashboard
GET /api/organizer/dashboard

// My events
GET /api/organizer/events
POST /api/organizer/events           // Create
PUT  /api/organizer/events/:id      // Update

// Bookings for my events
GET /api/organizer/bookings

// Check-in
POST /api/organizer/check-in/:bookingId

// Payouts
GET /api/organizer/payouts
PUT /api/organizer/payout-method
{ method: "bank_transfer", details: { accountNumber: "..." } }

// Announcements
POST /api/organizer/events/:id/announcements
{ title: "Schedule change", message: "..." }
```

### Admin Routes
```javascript
// Users
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
POST   /api/admin/users/:id/suspend
POST   /api/admin/users/:id/activate
DELETE /api/admin/users/:id

// Organizer applications
GET /api/admin/organizer-applications
POST /api/admin/organizer-applications/:id/approve
POST /api/admin/organizer-applications/:id/reject

// Events moderation
GET /api/admin/events
POST /api/admin/events/:id/approve
POST /api/admin/events/:id/reject
POST /api/admin/events/:id/feature

// Categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

// All bookings & payments
GET /api/admin/bookings
GET /api/admin/payments
POST /api/admin/payments/:id/refund

// Reviews moderation
GET /api/admin/reviews/pending
POST /api/admin/reviews/:id/approve
POST /api/admin/reviews/:id/reject

// Payouts to organizers
GET /api/admin/payouts
POST /api/admin/payouts/:id/process

// Analytics
GET /api/admin/dashboard
GET /api/admin/analytics/revenue?startDate=2024-01-01&endDate=2024-12-31
GET /api/admin/analytics/users
GET /api/admin/analytics/events

// Settings
GET /api/admin/settings
PUT /api/admin/settings/:key

// Support tickets
GET /api/admin/contact-messages
POST /api/admin/contact-messages/:id/reply
```

---

## 🔐 Authentication Flow

### JWT Token Strategy
```javascript
// 1. Login → Get tokens
const { accessToken, refreshToken, user } = await AuthAPI.login({
  email: "user@example.com",
  password: "password"
});

// 2. Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// 3. Auto-refresh on 401
// (Handled in api.js interceptor)

// 4. Logout
await AuthAPI.logout();
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

### Protected Route Example
```javascript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

---

## 🛒 Booking Flow (Real-World Scenario)

```javascript
// 1. User adds tickets to cart
await CartAPI.add(ticketTypeId, 2);

// 2. User applies promo code
await CartAPI.applyPromo("SUMMER20");

// 3. User proceeds to checkout
const cart = await CartAPI.get();

// 4. Create booking
const booking = await BookingsAPI.create({
  eventId: cart.eventId,
  items: cart.items,
  promoCode: cart.appliedPromo,
  attendeeDetails: [/* per ticket */]
});

// 5. Initialize payment
const payment = await PaymentsAPI.initialize(booking.id);

// 6. Show payment gateway (Razorpay/Stripe)
const gateway = new Razorpay({
  key: payment.gatewayKey,
  order_id: payment.gatewayOrderId,
  amount: payment.amount,
  handler: async (response) => {
    // 7. Verify payment
    await PaymentsAPI.verify({
      bookingId: booking.id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    });
    
    // 8. Show success, redirect to tickets
    navigate(`/bookings/${booking.id}/success`);
  }
});
gateway.open();

// 9. Handle failed payment (retry with different method)
// 10. Send confirmation email
// 11. Generate tickets with QR codes
// 12. Add to calendar (optional)
```

---

## 📊 Real-World Problem Solutions

### 1. Race Condition - Ticket Inventory
```sql
-- Optimistic locking with version
UPDATE ticket_inventory 
SET available_count = available_count - $1,
    reserved_count = reserved_count + $1,
    version = version + 1
WHERE ticket_type_id = $2 
  AND available_count >= $1
  AND version = $3  -- Expected version
RETURNING *;
```

### 2. Double Booking Prevention
```javascript
// Database unique constraint on booking_items
// + Cart expiry (15 minutes)
// + Soft reservation pattern
```

### 3. Payment Failure Recovery
```sql
-- Payment attempts tracking
INSERT INTO payment_attempts (payment_id, attempt_number, status, error_code)
VALUES ($1, $2, 'failed', $3);

-- Auto-retry logic in backend
-- Email notification for failed payments
-- Cart restoration after failure
```

### 4. Concurrency - Seat Selection
```sql
-- Pessimistic locking for seat selection
SELECT * FROM ticket_inventory 
WHERE ticket_type_id = $1 
FOR UPDATE;
```

### 5. GDPR Compliance
```sql
-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = $1;

-- Data export
SELECT * FROM users WHERE id = $1;
SELECT * FROM bookings WHERE user_id = $1;
SELECT * FROM payments WHERE user_id = $1;
-- ... combine into export format

-- Data anonymization for analytics
UPDATE reviews SET user_id = NULL WHERE user_id = $1;
```

---

## 🚀 Deployment Checklist

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/eventify_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx

# Storage (AWS S3 or Cloudinary)
S3_BUCKET=eventify-uploads
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx

# Frontend
CLIENT_URL=https://eventify.com
```

### Database Setup
```sql
-- 1. Create database
CREATE DATABASE eventify_db;

-- 2. Run schema
\i backend/database-schema-complete.sql

-- 3. Verify
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Should return ~30 tables
```

### Backend Setup
```bash
cd backend
npm install
npm run migrate      # If using migrations
npm run seed         # Insert sample data
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Check PostgreSQL is running
- Verify connection string
- Check firewall settings

**2. Foreign Key Violation**
```
ERROR: insert or update on table violates foreign key constraint
```
- Ensure referenced record exists
- Check UUID format
- Verify case sensitivity

**3. JWT Expired**
```
Error: jwt expired
```
- Frontend should auto-refresh token
- Or redirect to login

**4. CORS Error**
```
Access-Control-Allow-Origin header missing
```
- Check CORS configuration in backend
- Verify CLIENT_URL env variable

---

## 📈 Next Steps

1. **Run the database schema** in PostgreSQL
2. **Update backend routes** to use new controllers
3. **Test APIs** with Postman/Insomnia
4. **Integrate frontend** with apiService.js
5. **Set up payment gateway** (Razorpay/Stripe)
6. **Configure email** for notifications
7. **Deploy** to production

---

**Need help?** Check the console logs and database queries for debugging!
