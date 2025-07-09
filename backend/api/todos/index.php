<?php
require_once '../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all todos
            $stmt = $pdo->query('SELECT * FROM todos ORDER BY created_at DESC');
            $todos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $todos
            ]);
            break;
            
        case 'POST':
            // Create new todo
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['title']) || empty(trim($data['title']))) {
                throw new Exception('Title is required');
            }
            
            $stmt = $pdo->prepare('INSERT INTO todos (title, description) VALUES (?, ?)');
            $stmt->execute([
                trim($data['title']),
                isset($data['description']) ? trim($data['description']) : ''
            ]);
            
            $id = $pdo->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Todo created successfully',
                'data' => [
                    'id' => $id,
                    'title' => trim($data['title']),
                    'description' => isset($data['description']) ? trim($data['description']) : '',
                    'completed' => false
                ]
            ]);
            break;
            
        default:
            http_response_code(405); // Method Not Allowed
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred',
        'error' => $e->getMessage()
    ]);
}
?>
