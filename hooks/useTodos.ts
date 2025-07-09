import { useState, useEffect, useCallback } from 'react';
import { todoService, Todo } from '@/lib/api';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (title: string, description?: string) => Promise<{ success: boolean; error?: string }>;
  toggleTodo: (id: number) => Promise<{ success: boolean; error?: string }>;
  deleteTodo: (id: number) => Promise<{ success: boolean; error?: string }>;
  updateTodo: (id: number, updates: Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log the API base URL
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost/collab-todo-frontend/backend/api');

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching todos...');
      const data = await todoService.getAll();
      console.log('Todos fetched:', data);
      setTodos(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      console.error('Error fetching todos:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add a new todo
  const addTodo = async (title: string, description: string = '') => {
    try {
      const newTodo = await todoService.create({ title, description, completed: false });
      setTodos((prev: Todo[]) => [newTodo, ...prev]);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return { success: false, error: 'Todo not found' };
      
      await todoService.update(id, { completed: !todo.completed });
      setTodos(prev =>
        prev.map((t: Todo) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a todo
  const deleteTodo = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await todoService.delete(id);
      setTodos(prev => prev.filter((todo: Todo) => todo.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update a todo
  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      await todoService.update(id, updates);
      setTodos(prev =>
        prev.map((todo: Todo) => (todo.id === id ? { ...todo, ...updates } : todo))
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    refetch: fetchTodos,
  };
};
