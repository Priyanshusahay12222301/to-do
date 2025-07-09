<?php
require_once '../../../config/database.php';

// Get the ID from the URL
$uri = $_SERVER['REQUEST_URI'];
$uriParts = explode('/', trim($uri, '/'));
$id = end($uriParts);

// Validate ID
if (!is_numeric($id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid todo ID'
    ]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get single todo
            $stmt = $pdo->prepare('SELECT * FROM todos WHERE id = ?');
            $stmt->execute([$id]);
            $todo = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$todo) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Todo not found'
                ]);
                exit();
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $todo
            ]);
            break;
            
        case 'PUT':
            // Update todo
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['title']) || empty(trim($data['title']))) {
                throw new Exception('Title is required');
            }
            
            $stmt = $pdo->prepare('UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?');
            $result = $stmt->execute([
                trim($data['title']),
                isset($data['description']) ? trim($data['description']) : '',
                isset($data['completed']) ? (bool)$data['completed'] : false,
                $id
            ]);
            
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Todo not found or no changes made'
                ]);
                exit();
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Todo updated successfully'
            ]);
            break;
            
        case 'DELETE':
            // Delete todo
            $stmt = $pdo->prepare('DELETE FROM todos WHERE id = ?');
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Todo not found'
                ]);
                exit();
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Todo deleted successfully'
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
