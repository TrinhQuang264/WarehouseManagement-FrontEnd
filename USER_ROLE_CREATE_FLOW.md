# User Create + Role Flow (Frontend)

## Muc tieu
- Tao form tao tai khoan voi body:
```json
{
  "email": "string",
  "phoneNumber": "string",
  "firstName": "string",
  "lastName": "string",
  "userName": "string",
  "password": "string"
}
```
- Hien thi va cap nhat roles bang checkbox, theo luong:
  - `GET /api/Roles/all`
  - `GET /api/Users/{id}/roles`
  - `PUT /api/Users/{id}/roles` voi `{ "roleNames": [...] }`

## API mapping da ap dung
- `src/features/users/api/usersService.js`
  - `createUser(data)` -> `POST /Users`
  - `getAllRoles()` -> `GET /Roles/all`
  - `getUserRoles(id)` -> `GET /Users/{id}/roles`
  - `replaceUserRoles(id, roleNames)` -> `PUT /Users/{id}/roles`

## Flow tao tai khoan
1. Admin bam "Them nguoi dung".
2. Mo modal "Tao tai khoan", nhap 6 truong bat buoc theo payload.
3. Load danh sach role tu `GET /Roles/all`, render checkbox `value = role.name`.
4. Submit:
   - Goi `POST /Users`.
   - Lay lai danh sach users (`GET /Users/all`) de tim `id` theo `email`.
   - Goi `PUT /Users/{id}/roles` de gan role (mac dinh `["User"]` neu chua check gi).

## Flow sua role
1. Bam icon but chi tren tung user.
2. Mo modal "Sua vai tro".
3. Check/uncheck role.
4. Goi `PUT /Users/{id}/roles` voi toan bo danh sach roles da check (replace toan bo).

## Luu y
- `PUT /Users/{id}/roles` la replace, khong phai add.
- Frontend chi gui roles ton tai trong `GET /Roles/all`.
- Axios da tu dong gan `Authorization: Bearer <token>` tu `localStorage.accessToken`.

## File da sua
- `src/features/users/api/usersService.js`
- `src/features/users/hooks/useUsers.jsx`
- `src/features/users/components/UsersPage.jsx`
