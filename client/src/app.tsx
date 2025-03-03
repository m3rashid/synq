import { useTodoModel } from './models/todo';

export function App() {
  const { todos } = useTodoModel();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>Todo List</h1>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{ padding: '4px 12px', width: '250px', boxShadow: '0 4px 12px #00000020', borderRadius: '4px' }}
          >
            <h2 style={{ fontSize: '1.2rem' }}>{todo.title}</h2>
            <p>{todo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
