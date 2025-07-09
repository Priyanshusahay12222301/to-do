import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useTodos();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    const result = await addTodo(newTodoTitle, newTodoDescription);
    if (result.success) {
      setNewTodoTitle('');
      setNewTodoDescription('');
    }
  };

  const startEditing = (todo: any) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleUpdateTodo = async (id: number) => {
    await updateTodo(id, {
      title: editTitle,
      description: editDescription,
    });
    setEditingId(null);
  };

  if (loading && todos.length === 0) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter todo title"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter description (optional)"
            rows={2}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={!newTodoTitle.trim()}
        >
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`p-4 border rounded-lg ${
                  todo.completed ? 'bg-green-50' : 'bg-white'
                }`}
              >
                {editingId === todo.id ? (
                  <div className="space-y-3">
                    <label htmlFor={`edit-title-${todo.id}`} className="sr-only">Edit title</label>
                    <input
                      id={`edit-title-${todo.id}`}
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter title"
                      aria-label="Edit todo title"
                    />
                    <label htmlFor={`edit-description-${todo.id}`} className="sr-only">Edit description</label>
                    <textarea
                      id={`edit-description-${todo.id}`}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={2}
                      placeholder="Enter description"
                      aria-label="Edit todo description"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateTodo(todo.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`todo-${todo.id}`}
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="h-5 w-5"
                          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not completed' : 'completed'}`}
                        />
                        <span
                          className={`text-lg ${
                            todo.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {todo.title}
                        </span>
                      </div>
                      {todo.description && (
                        <p className="mt-2 text-gray-600 text-sm">
                          {todo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(todo.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
