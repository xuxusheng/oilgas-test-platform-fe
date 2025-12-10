# 认证相关接口文档

本文档描述了系统中所有与用户认证相关的API接口，包括登录、注册、登出和获取用户信息等功能。

## 接口概览

| 接口路径 | 请求方法 | 功能描述 |
|---------|---------|---------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户信息 |

---

## 1. 用户登录

**接口路径**: `POST /api/auth/login`

**功能描述**: 用户通过用户名和密码进行登录验证，成功后返回访问令牌及相关信息。

### 请求参数

#### 请求体 (application/json)
```json
{
  "username": "string",
  "password": "string"
}
```

**字段说明**:
- `username`: 用户名，必填字段，最大长度50个字符
- `password`: 密码，必填字段，长度6-100个字符

### 响应结构

#### 成功响应 (200)
```json
{
  "code": 0,
  "message": "string",
  "data": {
    "accessToken": "string",
    "tokenType": "string",
    "expiresIn": 0,
    "expiresAt": {
      "seconds": 0,
      "nanos": 0
    },
    "userId": 0,
    "username": "string",
    "role": "string",
    "loginTime": {
      "seconds": 0,
      "nanos": 0
    }
  },
  "errors": {}
}
```

**响应字段说明**:
- `code`: 响应状态码
- `message`: 响应消息
- `data`: 响应数据
  - `accessToken`: 访问令牌，用于后续请求的身份验证
  - `tokenType`: 令牌类型（通常为Bearer）
  - `expiresIn`: 令牌剩余有效期（秒）
  - `expiresAt`: 令牌绝对过期时间
  - `userId`: 用户ID
  - `username`: 用户名
  - `role`: 用户角色（ADMIN 或 MEMBER）
  - `loginTime`: 登录时间

### 请求示例

```bash
curl -X POST 'https://your-api-domain/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### 响应示例

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "expiresAt": {
      "seconds": 1640000000,
      "nanos": 123456789
    },
    "userId": 1,
    "username": "admin",
    "role": "ADMIN",
    "loginTime": {
      "seconds": 1639996400,
      "nanos": 123456789
    }
  },
  "errors": {}
}
```

---

## 2. 用户注册

**接口路径**: `POST /api/auth/register`

**功能描述**: 新用户通过用户名和密码进行注册，创建新账户。

### 请求参数

#### 请求体 (application/json)
```json
{
  "username": "string",
  "password": "string"
}
```

**字段说明**:
- `username`: 用户名，必填字段，长度3-20个字符
- `password`: 密码，必填字段，长度6-30个字符

### 响应结构

#### 成功响应 (200)
```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "role": "string"
  },
  "errors": {}
}
```

**响应字段说明**:
- `code`: 响应状态码
- `message`: 响应消息
- `data`: 响应数据
  - `id`: 用户ID
  - `username`: 用户名
  - `role`: 用户角色（新注册用户默认为 MEMBER）

### 请求示例

```bash
curl -X POST 'https://your-api-domain/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "newuser",
    "password": "mypassword123"
  }'
```

### 响应示例

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "id": 2,
    "username": "newuser",
    "role": "MEMBER"
  },
  "errors": {}
}
```

---

## 3. 用户登出

**接口路径**: `POST /api/auth/logout`

**功能描述**: 登出当前登录用户，使访问令牌失效。

### 请求参数

#### 请求头
- 需要提供认证信息（通常是Bearer Token）

#### 请求体
无请求体

### 响应结构

#### 成功响应 (200)
```json
{
  "code": 0,
  "message": "string",
  "data": null,
  "errors": {}
}
```

**响应字段说明**:
- `code`: 响应状态码
- `message`: 响应消息
- `data`: 响应数据（登出成功时为null）
- `errors`: 错误信息（如果有错误）

### 请求示例

```bash
curl -X POST 'https://your-api-domain/api/auth/logout' \
  -H 'Authorization: Bearer your_access_token_here' \
  -H 'Content-Type: application/json'
```

### 响应示例

```json
{
  "code": 0,
  "message": "登出成功",
  "data": null,
  "errors": {}
}
```

---

## 4. 获取当前用户信息

**接口路径**: `GET /api/auth/me`

**功能描述**: 获取当前登录用户的详细信息。

### 请求参数

#### 请求头
- 需要提供认证信息（通常是Bearer Token）

#### 请求体
无请求体

### 响应结构

#### 成功响应 (200)
```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "role": "string"
  },
  "errors": {}
}
```

**响应字段说明**:
- `code`: 响应状态码
- `message`: 响应消息
- `data`: 响应数据
  - `id`: 用户ID
  - `username`: 用户名
  - `role`: 用户角色

### 请求示例

```bash
curl -X GET 'https://your-api-domain/api/auth/me' \
  -H 'Authorization: Bearer your_access_token_here'
```

### 响应示例

```json
{
  "code": 0,
  "message": "获取用户信息成功",
  "data": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  },
  "errors": {}
}
```

---

## 认证流程说明

### 标准认证流程

1. **用户注册**（如果还没有账户）
   ```bash
   POST /api/auth/register
   ```
   传入用户名和密码，创建新用户账户

2. **用户登录**
   ```bash
   POST /api/auth/login
   ```
   使用注册的用户名和密码登录，获取访问令牌

3. **存储令牌**
   将返回的 `accessToken` 安全存储（如localStorage、cookies等）

4. **访问受保护资源**
   在后续请求的HTTP头部添加认证信息：
   ```
   Authorization: Bearer your_access_token_here
   ```

5. **获取用户信息**
   ```bash
   GET /api/auth/me
   ```
   可以随时获取当前登录用户的信息

6. **用户登出**
   ```bash
   POST /api/auth/logout
   ```
   登出系统，使令牌失效

### 安全建议

- 使用HTTPS协议进行所有认证相关的通信
- 不要在客户端存储明文密码
- 访问令牌应有合理的过期时间
- 实现令牌刷新机制以提供更好的用户体验
- 在生产环境中实施速率限制和IP限制

---

## 错误处理

公共响应格式：
```json
{
  "code": "非0表示错误",
  "message": "错误描述",
  "data": null,
  "errors": {
    "字段名": ["错误详情"]
  }
}
```

常见错误场景：
- 用户名或密码错误
- 令牌过期或无效
- 用户名已存在（注册时）
- 输入参数格式错误