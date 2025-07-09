# Todo App Backend

This is a PHP + MySQL backend for the Todo application.

## Prerequisites

1. PHP 7.4 or higher
2. MySQL Server
3. Web server (Apache/Nginx) with PHP support

## Setup Instructions

1. **Create a MySQL database**
   ```sql
   CREATE DATABASE todo_app;
   ```

2. **Configure database connection**
   Update the database credentials in `config/database.php` if needed.

3. **Initialize the database**
   Open your browser and navigate to:
   ```
   http://localhost/backend/init_db.php
   ```
   This will create the necessary tables.

4. **Configure your web server**
   - Point your web server's document root to the `backend` directory
   - Make sure URL rewriting is enabled if you're using Apache with `.htaccess`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a single todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

## Todo Object Structure

```json
{
  "id": 1,
  "title": "Example Todo",
  "description": "This is an example todo",
  "completed": false,
  "created_at": "2023-01-01 12:00:00",
  "updated_at": "2023-01-01 12:00:00"
}
```

## Development

To test the API endpoints, you can use tools like Postman or cURL.
