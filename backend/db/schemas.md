
# Database Schemas

## User

-   **name**: String
-   **address**: String
-   **emailID**: String
-   **password**: String
-   **Cart**: List of CartItems
-   **OrderHistory**: List of Orders

## CartItem

-   **product**: Product
-   **price**: Number
-   **quantity**: Number
-   **size**: String (S/M/L)
-   **gift**: Boolean (wrapped/not wrapped)
-   **TotalPrice**: Number (quantity * price + (gift ? some_value : 0))

## Order

-   **items**: List of OrderItems
-   **orderDate**: Date
-   **totalAmount**: Number

## OrderItem

-   **productName**: String
-   **price**: Number
-   **quantity**: Number
-   **size**: String (S/M/L)
-   **gift**: Boolean

## Product

-   **productName**: String
-   **price**: Number
-   **image**: String (URL)
-   **size**: List of Strings (S/M/L)
-   **type**: String (shirt, jeans, etc.)
