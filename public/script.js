async function loadTodos() {

    const res = await fetch("/api/todos");
    const todos = await res.json();

    const list = document.getElementById("todoList");
    list.innerHTML = "";

    todos.forEach(todo => {

        const li = document.createElement("li");

        li.className =
        "flex justify-between items-center bg-slate-50 border rounded-lg px-3 py-2";

        const text = document.createElement("span");
        text.textContent = todo.text;

        const btn = document.createElement("button");

        btn.textContent = "delete";
        btn.className =
        "text-red-500 hover:text-red-700 text-sm";

        btn.onclick = () => deleteTodo(todo.id);

        li.appendChild(text);
        li.appendChild(btn);

        list.appendChild(li);

    });

}

async function addTodo() {

    const input = document.getElementById("todoInput");

    if (!input.value) return;

    await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value })
    });

    input.value = "";

    loadTodos();

}

async function deleteTodo(id) {

    await fetch(`/api/todos/${id}`, {
        method: "DELETE"
    });

    loadTodos();

}

loadTodos();