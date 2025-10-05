# E-commerce Application Schema and Class/Module Breakdown

This document provides a consolidated reference for the application's data structure (classes and schemas) and the complete breakdown of the RESTful API endpoints, organized by module.

---

## 1. Core Class & Schema Definitions

The application is built around five primary entities that map directly to the NoSQL database collections, defining the structure and relationships of the application data.

| Class | Purpose | Key Attributes | Relationships & Notes |
| :--- | :--- | :--- | :--- |
| **User** | Represents a customer account. | `id`, `name`, `address`, `emailID`, `password` (hashed) | Holds lists of `cart` (CartItem references) and `orderHistory` (Order references). |
| **Product** | Represents a single item in the inventory catalog. | `id`, `productName`, `price`, `image`, `availableSizes`, `type`, `stockQuantity` | No direct outgoing relationships. |
| **CartItem** | A line item within a user's *active* shopping cart. | `productName`, `price`, `quantity`, `size`, `gift` | References the **`product`** ID. |
| **Order** | A single completed transaction record. | `id`, `orderDate`, `totalAmount`, `status` | References the **`user_id`** and contains a list of **`items`** (OrderItem documents). |
| **OrderItem** | A line item *snapshot* within a historical order. | `productName`, `price`, `quantity`, `size`, `gift` | A denormalized record, capturing the product details at the time of sale. |

---

## 2. API Endpoint Breakdown by Module

The backend functionality is divided across six distinct router modules, managing everything from authentication to order fulfillment.

### 1. `userRouter` (Authentication & User Management)

| Method | Endpoint | Description | Key Security Logic |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieves a list of all users. | *(Admin or debug function)* |
| `GET` | `/:userId` | Retrieves a specific user by ID. | |
| `POST` | `/signup` | Registers a new user. | **Hashes the password using `bcrypt`** before saving. |
| `POST` | `/login` | Authenticates a user. | Finds user by `emailID` and **compares password with stored hash using `bcrypt`**. |

---

### 2. `productRouter` (Product Catalog)

| Method | Endpoint | Description | Query Parameter Support |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieves the list of products. | **`search`**, **`sortBy`**, **`type`**, **`page`**, **`limit`** for filtering, searching, and pagination. |
| `POST` | `/` | Adds a new product to the catalog. | *(Admin function)* |
| `DELETE` | `/:productId` | Deletes a product by ID. | *(Admin function)* |

---

### 3. `cartRouter` (Shopping Cart)

| Method | Endpoint | Description | Key Business Logic |
| :--- | :--- | :--- | :--- |
| `GET` | `/:userId` | Retrieves a user's shopping cart. | **Validation Logic:** Checks for product existence; **invalid items are automatically removed**. |
| `POST` | `/:userId` | Adds a new item to the cart. | Checks if the exact item (product + size) is already in the cart to **prevent duplication**. |
| `PUT` | `/:userId/:cartItemId` | Updates a specific cart item. | Allows modifications to `quantity`, `size`, or `gift` status. |
| `DELETE` | `/:userId/:cartItemId` | Removes a specific item from the cart. | Deletes the `CartItem` document and removes its reference from the User's cart list. |

---

### 4. `checkoutRouter` (Order Creation)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/:userId` | **Finalizes the purchase** and creates a new `Order` by converting the user's cart items into `OrderItem` snapshots. |

---

### 5. `orderRouter` (User Order History)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:userId` | Retrieves a user's complete order history, **populating** the `orderHistory` references. |

---

### 6. `orderItemRouter` (Order Details)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:orderId` | Retrieves the specific line items (`OrderItem`) for a given order ID, **populating** the `items` references. |