# User Session

There are only a few session related information stored in the hubble PWA, to keep the front and backend in sync. This
information is stored clientside as cookies and accessible through the runtime via Vuex.

Some API calls require an ID or token to assign a request to a user session. 
For example: fetch a cart, place order, get customer. 

Some other API calls generate a new ID or token for a new session or for security purposes. 
For example: add to cart, login.
As soon as the API response includes a token, hubble stores it as a cookie and as a vuex store state, so it can
be used for all further calls that require a session ID or token.

## Shopware
### Context Token
In Shopware the session ID or token is called _context token_.

### Guest
The user is assigned to a valid _context token_ and the customer **guest flag** inside the session **is true**.

### Logged In
The user is assigned to a valid _context token_ and the customer **guest flag** inside the session **is false**.