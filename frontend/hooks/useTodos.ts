import { useState, useEffect, useCallback } from 'react';

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
};

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

  // Initialize with some sample todos
  useEffect(() => {
    const sampleTodos: Todo[] = [
      { id: 1, title: 'Learn React', description: 'Complete React tutorial', completed: true },
      { id: 2, title: 'Build a Todo App', description: 'Create a simple todo application', completed: false },
      { id: 3, title: 'Deploy App', description: 'Deploy the todo app to production', completed: false },
    ];
    setTodos(sampleTodos);
    setLoading(false);
  }, []);

  // Add a new todo
  const addTodo = async (title: string, description: string = '') => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
    return { success: true };
  };

  // Toggle todo completion status
  const toggleTodo = async (id: number) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updated_at: new Date().toISOString() }
          : todo
      )
    );
    return { success: true };
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    return { success: true };
  };

  // Update a todo
  const updateTodo = async (id: number, updates: Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at'>>) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              ...updates, 
              updated_at: new Date().toISOString() 
            } 
          : todo
      )
    );
    return { success: true };
  };

  // Refetch todos (just returns the current state)
  const refetch = async () => {
    return Promise.resolve();
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    refetch,
  };
};
