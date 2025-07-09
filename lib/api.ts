const API_BASE_URL = 'http://localhost/collab-todo-frontend/backend/api';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const todoService = {
  // Get all todos
  async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch todos');
    }
    return data.data;
  },

  // Get a single todo
  async getById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch todo');
    }
    return data.data;
  },

  // Create a new todo
  async create(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create todo');
    }
    return data.data;
  },

  // Update a todo
  async update(
    id: number,
    updates: Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to update todo');
    }
  },

  // Delete a todo
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete todo');
    }
  },
};

export default todoService;
