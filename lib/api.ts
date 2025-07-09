const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow'
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        response: data,
      });
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data.data || data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

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
    return apiRequest<Todo[]>('/todos');
  },

  // Get a single todo
  async getById(id: number): Promise<Todo> {
    return apiRequest<Todo>(`/todos/${id}`);
  },

  // Create a new todo
  async create(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo> {
    return apiRequest<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  },

  // Update a todo
  async update(
    id: number,
    updates: Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    return apiRequest<void>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a todo
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default todoService;
