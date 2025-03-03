import { FormEvent, useCallback, useEffect, useState } from 'react';
import { todoModel, useTodoModel } from './models/todo';

function AddTodoButton() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleFormSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries());
    console.log(values);
    todoModel.create(values);
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button type='button' className='btn' onClick={openModal}>
        Add Todo
      </button>

      {open && (
        <div className='add-todo-root'>
          <div className='overlay' onClick={closeModal} />
          <div className='content'>
            <div className='add-todo-header'>
              <h2>Add Todo</h2>
              <button type='button' className='btn' onClick={closeModal}>
                🗙
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className='add-todo-form'>
              <input name='title' type='text' placeholder='Title' />
              <textarea name='description' placeholder='Description' />
              <button type='submit' className='btn'>
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function App() {
  const { todos } = useTodoModel();

  useEffect(() => {
    todoModel.forceSync();
  }, []);

  return (
    <div className='parent'>
      <div className='header'>
        <h1>Todo List</h1>
        <AddTodoButton />
      </div>

      <div className='todolist-container'>
        {todos.map((todo) => (
          <div key={todo.id} className='todo-container'>
            <h2 style={{ fontSize: '1.2rem' }}>{todo.title}</h2>
            <p>{todo.description}</p>

            <button
              type='button'
              className='btn'
              onClick={() => {
                todoModel.delete(todo.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
