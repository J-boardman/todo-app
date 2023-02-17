(async() => {
  let todoList = JSON.parse(localStorage.getItem("todos")) || [];
  let darkMode = localStorage.getItem("darkMode") || false;
  
  const toggleThemeBtn = document.querySelector("[data-toggleTheme]");
  const toggleTheme = () => {
    darkMode = !darkMode;
    document.body.dataset.theme = darkMode ? "dark" : "light"
    document.querySelector("i").className = darkMode ? "ri-moon-line text-4xl" : "ri-sun-line text-4xl";
    localStorage.setItem("darkMode", darkMode)
  }
  toggleTheme();
  
  toggleThemeBtn.addEventListener("click", toggleTheme);

  const saveTodos = (todos) => {
    const sortedTodos = todos.sort((a,b) => new Date(a.due) - new Date(b.due));
    localStorage.setItem("todos", JSON.stringify(sortedTodos));
    renderTodos(sortedTodos);
    todoList = sortedTodos;
  }

  const handleSubmit = (e) => {
    const form = e.target;
    e.preventDefault();
    const newItem = {
      created: new Date(), id: "id" + Math.random().toString(16).slice(2), 
      title: form[0].value,
      due: form[1].value || new Date(),
      completed: false,
    }
    saveTodos([...todoList, newItem]);
    form.reset();
  };
  
  const handleUpdate = (e) => {
    const updatedTodos = todoList.map(todo => todo.id == e.target.dataset.id
      ? {...todo, completed: !todo.completed}
      : todo
    )
    saveTodos(updatedTodos);
  }

  const handleDelete = (e) => saveTodos(todoList.filter(todo => todo.id != e.target.value));

  const renderTodos = (todos) => {
    document.querySelector('.todos').innerHTML = todos?.length
    ? todos.map(todo => {
      return (`
        <div class="grid grid-cols-[min-content,_1fr,_1fr,_min-content] gap-4 items-center justify-around">
          <input class="checkbox" data-checkbox type="checkbox" ${todo.completed && "checked"} data-id="${todo.id}"/>
          <p class="${todo.completed && "line-through"}">${todo.title}</p>
          <p class="${todo.completed && "line-through"} hidden sm:block">${new Date(todo.due).toDateString()}</p>
          <button data-deleteBtn value="${todo.id}" class="btn btn-primary btn-sm">Delete</button>
        </div>
      `)}
      
      )
      .sort((a, b) => new Date(a.due) - new Date(b.due)) 
      .reduce((a,b) => a+b)
    : "<p>No todos found...</p>"
    
    document.querySelectorAll("[data-checkbox]").forEach(box => box.addEventListener("click", handleUpdate));
    document.querySelectorAll("[data-deleteBtn]").forEach(btn => btn.addEventListener("click", handleDelete));
    document.querySelector("form").addEventListener("submit", handleSubmit);
  }
  saveTodos(todoList);
})();