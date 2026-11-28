# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
    Building a UI imperatively (plain DOM code) requires to write the instructions step by step to tell the browser how to find and manually manipulate DOM elements. For example like using document.getElementById. Whereas, building a UI declaratively (React) can let us to describe what UI should like for a given state. Not only that, React automatically updates the DOM to match whenever the state changes.

2. Why must a component name start with a capital letter?
    It is to distinguish custome React components from standard built-in HTML tags. It compiles them as standard HTML when JSX sees lowercased, such as <div/> or <p/>. Meanwhile, when JSX sees like <Header/> or <VendorCard/>, it will tells React to look for and render a custom JavaScript component.

3. What does a fragment <>...</> do, and why not just use a <div>?
    A fragment <>...</> lets group multiple elements together without adding an unnessary extra wrapper node to actual HTML DOM tree. If using a <div>, it will adds an extra structural container to DOM, mess uo CSS layouts and clutter the HTML structure.

4. Name one benefit of splitting the UI into small components.
    One benefit of splitting the UI into small components is making the code reusable and significantly easier to maintain across the application. 

# Week 6 reflection
1. Explain, step by step, what happens from the moment you click 'Place order' until the new order appears on your Orders page. Name the functions in your own code that run, and say why you never call setOrders yourself.
    When we click 'Place order', to submit checkout form on 'CartPage', 'handlePlaceOrder' runs and calls 'placeOrders(user, cart, details)' in 'src/services/orders.js'. Then, inside 'placeOrders', items in the cart are grouped by 'vendorId' using 'Map' so one order document is created per vendor inside a Firestore 'writeBatch'. Each document arragement is like this, 'createdAt: serverTimestamp()', line items, mahallah, pickupTime, 'status: Received', studentName, 'studentUid: user.uid', total, vendorId and vendorName. Then, it will be saved by 'await batch.commit()' to 'orders' collection. Back at the 'CartPage', 'clearCart()' will empties the cart and 'navigate('/orders')' moves the app to 'OrdersPage', where 'useMyOrders()' in 'src/hooks/useMyOrders.js' calls 'subscribeToMyOrders(user.uid,...)' from 'src/services/orders.js'. Inside 'subscribeToMyOrders', 'onSnapshot' listener queries 'orders', filtered by 'studentUid'. After that, the results passes into 'onData' callback, which runs 'setOrders(data)' inside 'useMyOrders'. Event handlers like 'handlePlaceOrder' from 'CartPage', 'changePickupTime' and 'cancelOrder' from 'src/services/orders.js' write directly to Firestore rather than manually mutating order state in React. So, real-time 'onSnapshot' listener will keep 'OrdersPage' in sync as single source of truth. So, whenever a document is added, updated or deleted in Firestore, the snapshot callback automatically pushes the latest list into state and updates the UI

2. Why is orders a top-level collection, and why does each order copy vendorName and each item’s name and price instead of storing only IDs?
    'orders' is a top-level collection rather than nested under single vendor or student document is because students view all of their own orders across multiple vendors on 'OrdersPage', while vendors or staff manage incoming orders by vendor ID without reading unrelated subcollections. Each order copy vendorName and each item's name and price at checkout time instead of storing only IDs so that historical orders will stay accurate and readable although vendor edits a menu item's price, renames a dish, or changes shop details in Firestore. Furthermore, storing only IDs will require extra lookups or cause past receipts to reflect current menu edits instead of what student actually ordered and paid of.

3.  Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it? Paste that line.
    - Personal feature: Spice-level badge & filter
    - Which firestore path: 'vendors/{vendorId}/menu/{itemId}'
    - Which fields hold its data: each menu item's numeric 'spiceLevel' field ('0' to '3')
    - Which line of code that reads it: 'MenuItemCard' reads 'item.spiceLevel' directly from Firestore item object to render spice badge.'subscribeToMenu' in 'src/services/vendors.js' filters items in Firestore using 'where('spiceLevel', '<=', Number(maxSpice ?? 3))'
    - Paste line that queries and reads the field: 'const q = query(menuRef. where('spiceLevel', '<=', Number(maxSpice ?? 3)))' from 'src/services/vendors.js'

4. Bug Hit Today (Section 4.3 of M2 Prep)
    - What happened: While wiring up 4-argument 'subscribeToMenu(vendorId, maxSpice, onData, onError)' with 'useVendor(id, activeMaxSpice)' and 'VendorPage.jsx', I hit 'TypeError: onData is not function', a 'ReferenceError: filteredMenu is not defined' and 'ReferenceError: query is not defined'
    - The cause: leaving old 3-argument 'subscribeToMenu' in 'vendors.js', forget to import 'query' and 'where' from 'firebase/firestore' and still pass removed local 'filteredMenu' variable in 'VendorPage'
    - Fixed: update 'subscribeToMenu' to accept 'maxSpice' and run 'query(...,where('spiceLevel', '<=',...))', import query and 'where' in 'vendors.js' and pass 'itemsWithVendor' from live Firestore subscription into 'MenuList'

# Week 7 reflection
1.  Copy one rule from your firestore.rules (the order or the menu rule) and explain it line by line: who is allowed, and which condition stops everyone else.
    - allow update: if signedIn()
        && resource.data.vendorOwnerUid == request.auth.uid
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status'])
    - this firestore.rules is under 'match /orders/{orderId}', which is for vendor status update rule
    - Firstly, 'signedIn()' checks 'request.auth != null' and blocking unauthenticated requests immediately. The, 'resource.data.vendorOwnerUid == request.auth.uid' will ensure only the authenticated user who owns the vendor shop for that order can update it, stopping students or other stall owners. Finally, 'request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status'])' restricts the write so that only the 'status' field is modified. Firestore will denies the write if the vendor or someone else tries to alter 'total', 'studentUid', 'items', or 'pickupTime' in the same update.

2.  For users, vendors, menu and orders: who can read and who can write each one, according to your rules?
    - 'users/{uid}' > only matching user ('request.auth.uid == uid') or 'admin' can read or update the profile. This means, non-admins cannot change their 'role' field. Also, users can create their own initial 'student' profile, and only 'admin' can delete user documents.
    - 'vendors/{vendorId}' > anyone, including visitors can read approved shops ('approved == true'). Owners and admins can read approved and unapproved ones. Authenticated users can create vendor application only with 'approved: false' and their own 'ownerUid'. Shop owners can update non-protected fields their own shop. Only admin can approve shops or delete vendors.
    - 'vendors/{vendorId}/menu/{itemId}' > anyone can read menu items as long as browse stays open. But only admins or shop's 'ownerUid' can write (create, update, delete) menu items.
    - 'orders/{orderId}' > only order's 'studentUid', the order's 'vendorOwnerUid' or 'admin' can read order. Signed in student can create order for themselves with 'status == 'Received' and matching 'vendorOwnerUid'. Vendors can update only 'status' while students can only update 'pickupTime' or delete the order while its status is 'Received'.

3. Why is hiding the vendor buttons in React not enough to stop a student changing a menu price? What actually stops it?
    - Hiding dashboard links or 'Add item'/'Delete' buttons in React ('RoleRoute' or conditional rendering) only controls what appears in user interface. Since React runs in browser, any user can open browser DevTools (F12), inspect the client bundle or run direct Firestore SDK calls in console to attempt 'updateDoc' or 'deleteDoc' on menu item or user document. Client-side checks can be bypassed because the browser is under user's control. So the thing that actually stops unauthorized changes is [Firestore Security Rules] ('firestore.rules'), which enforced on Google's servers on every database read and write regardless of how the request was sent. If student attempts to update menu price directly, Firestore will evaluates the rule server-side and rejects the request with 'permission-denied'.