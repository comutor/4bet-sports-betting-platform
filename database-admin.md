# Database Administration Guide

## Viewing Database Contents

### 1. View All Users
```sql
SELECT * FROM users ORDER BY id;
```

### 2. View User Details with Formatting
```sql
SELECT 
    id,
    first_name || ' ' || last_name as full_name,
    username,
    country,
    phone_number,
    balance,
    created_at
FROM users 
ORDER BY id DESC;
```

### 3. Count Users by Country
```sql
SELECT country, COUNT(*) as user_count 
FROM users 
GROUP BY country;
```

## Database Cleanup Commands

### Delete Specific User
```sql
DELETE FROM users WHERE id = [user_id];
```

### Delete User by Phone Number
```sql
DELETE FROM users WHERE phone_number = '+211923864463';
```

### Delete All Test Users (be careful!)
```sql
DELETE FROM users WHERE username LIKE '%test%' OR username LIKE '%admin%';
```

### Reset User Balance
```sql
UPDATE users SET balance = '0.00' WHERE id = [user_id];
```

## Database Schema Information

### View Table Structure
```sql
\d users
```

### View All Tables
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Useful Queries for Development

### Find Users with Specific Balance
```sql
SELECT * FROM users WHERE balance::numeric > 0;
```

### Search Users by Name
```sql
SELECT * FROM users WHERE first_name ILIKE '%admin%' OR last_name ILIKE '%admin%';
```

### View Recent Signups
```sql
SELECT * FROM users ORDER BY id DESC LIMIT 5;
```