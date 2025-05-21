/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [todoModal, setTodoModal] = useState(false);

  const [query, setQuery] = useState('');

  const firstRender = useRef(true);

  const todoRef = useRef<Todo | null>();
  const closeTodoModalRef =
    useRef<React.Dispatch<React.SetStateAction<boolean>>>();

  useEffect(() => {
    setTodosLoading(true);

    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(e => {
        throw new Error(e);
      })
      .finally(() => setTodosLoading(false));

    firstRender.current = false;
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      return;
    }

    if (query) {
      setTodos(() => {
        return todos.filter(todo => todo.title.toLowerCase().includes(query));
      });
    }
  }, [query]);

  function showTodoModal(
    todo: Todo,
    setButtonPressed: React.Dispatch<React.SetStateAction<boolean>>,
  ): void {
    setTodoModal(true);

    todoRef.current = todo;
    closeTodoModalRef.current = setButtonPressed;
  }

  function hideTodoModal(): void {
    setTodoModal(false);
    todoRef.current = null;
    if (closeTodoModalRef.current) {
      closeTodoModalRef.current(false);
    }
  }

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter query={query} setQuery={setQuery} />
            </div>

            <div className="block">
              {todosLoading && <Loader />}
              {!todosLoading && todos && (
                <TodoList todos={todos} showTodoModal={showTodoModal} />
              )}
            </div>
          </div>
        </div>
      </div>

      {todoModal && todoRef.current && (
        <TodoModal todo={todoRef.current} handleClose={hideTodoModal} />
      )}
    </>
  );
};
