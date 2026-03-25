# **Checklist for API Integration**

## Detailed Steps for Integrating a Single API Endpoint
For every API endpoint to be integrated, you should follow this detailed checklist:
- [ ] **1. API Endpoint Constant:** Define the endpoint URL in your constants or config file.
- [ ] **2. Service Layer Function:** Create an asynchronous API calling function (using Axios/fetch) inside the `services` folder. Handle the HTTP request method and payload.
- [ ] **3. State Management (Redux/Context):** If the data needs to be accessed globally, create corresponding Redux Thunks, Actions, and update the Reducers (in `slices/` folder).
- [ ] **4. Custom React Hook (Optional):** Create a hook (e.g., `useFetchData`, React Query, or SWR) to encapsulate logic, loading, and error states.
- [ ] **5. UI Component Integration:** Import the service/action into your React component and hook it up to user events (e.g., `onSubmit`, `onClick`, or `useEffect`).
- [ ] **6. Loading State UI:** Add loading indicators (spinners, skeletons, or disabled buttons) when the API request is pending.
- [ ] **7. Error Handling & Feedback:** Catch errors and show appropriate messages to the user (e.g., Toast notifications, inline form errors).
- [ ] **8. Success Handling & Feedback:** Handle the success flow (e.g., showing a success Toast, clearing form inputs, closing modals, or redirecting to another page).

---

## 1. Authentication APIs

### `POST /api/Authentication/Login`
- [ ] **Service:** Create `login(credentials)` function in `authService.js`.
- [ ] **State:** Save user info and JWT token into Redux store / Context and persist to `localStorage` or cookies.
- [ ] **UI:** Connect to the `LoginPage` form submit action.
- [ ] **Feedback:** Show Login Loading, Error Toast on failure, and Redirect to Dashboard upon success.

### `POST /api/Authentication/refresh-token`
- [ ] **Service:** Create `refreshToken(data)` function.
- [ ] **Integration:** Hook this up inside an Axios Response Interceptor to run automatically when a `401 Unauthorized` token expiry error is intercepted.
- [ ] **State:** Update the renewed token in `localStorage` and Redux store seamlessly.

### `POST /api/Authentication/change-password`
- [ ] **Service:** Create `changePassword(data)` function.
- [ ] **UI:** Connect to the Change Password form inside User Profile settings.
- [ ] **Feedback:** Show Success Toast, clear form fields. Optionally, force the user to re-login.

### `POST /api/Authentication/logout`
- [ ] **Service:** Create `logout()` function (if the backend requires invalidating the token).
- [ ] **State:** Clear JWT token, user details from Redux store/Context and remove from `localStorage`/cookies.
- [ ] **UI:** Connect to the Logout buttons (Sidebar, Header).
- [ ] **Feedback:** Redirect user back to the `LoginPage`.

---

## Upcoming API Modules (To Be Integrated)
- [ ] **Categories**
- [ ] **Customers**
- [ ] **Functions**
- [ ] **Permissions**
- [ ] **Products**
- [ ] **Purchases**
- [ ] **RolePermissions**
- [ ] **Roles**
- [ ] **StockTransactions**
- [ ] **Suppliers**
- [ ] **Test**
- [ ] **Users**
