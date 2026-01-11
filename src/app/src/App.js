import './App.css';
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Main App Component
 * Manages TODO list display and creation using React Hooks
 */
export function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all TODOs from backend
   * Uses useCallback to memoize the function
   */
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch TODOs: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
      console.log('Successfully fetched todos:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching TODOs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch TODOs on component mount
   * Runs once when component initializes
   */
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * Handle form submission for creating new TODO
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!description.trim()) {
      setError('Please enter a TODO description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create TODO: ${response.statusText}`);
      }

      const createdTodo = await response.json();
      console.log('Successfully created todo:', createdTodo);
      
      // Clear input field
      setDescription('');
      
      // Refresh todos list
      await fetchTodos();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create TODO';
      setError(errorMessage);
      console.error('Error creating TODO:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Error Message Display */}
      {error && (
        <div className="error-message" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* TODO List Section */}
      <section className="todos-section">
        <h1>List of TODOs</h1>
        
        {loading && <p className="loading">Loading...</p>}
        
        {!loading && todos.length === 0 && (
          <p className="empty-state">No TODOs yet. Create one to get started!</p>
        )}
        
        {todos.length > 0 && (
          <ul className="todos-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <span className="todo-description">{todo.description}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Create TODO Form Section */}
      <section className="create-todo-section">
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label htmlFor="todo-input">ToDo Description:</label>
            <input
              id="todo-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Enter TODO description (e.g., Buy groceries)"
              className="todo-input"
              maxLength={200}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
              aria-busy={loading}
            >
              {loading ? 'Adding...' : 'Add ToDo!'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default App;
