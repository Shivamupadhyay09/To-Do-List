import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todoTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const trimmedTask = task.trim();
    if (!trimmedTask) {
      alert('Task cannot be empty.');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedTask,
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);
    setTask('');
  };

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (confirm) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortToggle = () => {
    setSortAsc(prev => !prev);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'active') return !task.completed;
      return true;
    });
  };

  const getSortedTasks = (filtered) => {
    return [...filtered].sort((a, b) => {
      const aText = a.text.toLowerCase();
      const bText = b.text.toLowerCase();
      return sortAsc
        ? aText.localeCompare(bText, undefined, { sensitivity: 'base' })
        : bText.localeCompare(aText, undefined, { sensitivity: 'base' });
    });
  };

  const visibleTasks = getSortedTasks(getFilteredTasks());

  return (
    <div className="todo-container">
      <h2 className="todo-title">📝 To-Do List</h2>

      <div className="todo-input-group">
        <input
          type="text"
          className="todo-input"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button onClick={handleAddTask} className="todo-add-btn">
          Add
        </button>
      </div>

      <div className="todo-controls">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="todo-filter"
          aria-label="Filter tasks"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleSortToggle} className="todo-sort-btn" title="Toggle sort order">
          Sort {sortAsc ? '⬆️ A-Z' : '⬇️ Z-A'}
        </button>
      </div>

      <ul className="todo-list">
        {visibleTasks.length === 0 ? (
          <li className="todo-empty">No tasks available.</li>
        ) : (
          visibleTasks.map(task => (
            <li
              key={task.id}
              className={`todo-item ${task.completed ? 'completed' : ''}`}
            >
              <span
                onClick={() => handleToggleComplete(task.id)}
                className="todo-text"
                title="Click to mark as complete/incomplete"
              >
                {task.text}
              </span>

              {/* Status Label */}
              <span className={`todo-status ${task.completed ? 'completed-label' : 'active-label'}`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>

              <button
                onClick={() => handleDelete(task.id)}
                className="todo-delete-btn"
                title="Remove task"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
