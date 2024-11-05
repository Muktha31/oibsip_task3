const input=document.querySelector("input");
const addButton=document.querySelector(".add-button")
const todosHtml=document.querySelector(".todos")
const imge=document.querySelector(".img");
let todosJson=JSON.parse(localStorage.getItem("todos"))||[];
const deleteAllButton=document.querySelector(".delete-all");
const filters=document.querySelectorAll(".filter");
let filter='';

showTodos();

function formatDateTime(dateObj) {
    const date = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${date}/${month}/${year} ${hours}:${minutes}`;
}


function getTodoHtml(todo,index){
    if(filter && filter!=todo.status){
        return '';
    }
    let checked=todo.status=="completed"?"checked":"";

    let addedOn = `Added: ${formatDateTime(new Date(todo.addedOn))}`;
    let completedOn = todo.completedOn ? `Completed: ${formatDateTime(new Date(todo.completedOn))}` : '';
    return /*html*/ `
    <li class="todo">
        <label for="${index}">
            <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
            <span class="${checked}">${todo.name}</span>
        </label>
        <div class="timestamp">
            ${addedOn}
            ${completedOn ? `<br>${completedOn}` : ''}
        </div>
        <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
    `;
}

function showTodos(){
    if(todosJson.length==0){
        todosHtml.innerHTML='';
        imge.style.display='block';
    }else{
        todosHtml.innerHTML=todosJson.map(getTodoHtml).join('');
        imge.style.display='none';
    }
}

function addTodo(todo){
    input.value="";
    const now = new Date();
    todosJson.unshift({
        name:todo,
        status:"pending",
        addedOn:now,
        completedOn:null
    });
    localStorage.setItem("todos",JSON.stringify(todosJson));
    showTodos();
}

input.addEventListener("keyup",e=>{
    let todo=input.value.trim();
    if(!todo||e.key!="Enter"){
        return;
    }
    addTodo(todo);
});

addButton.addEventListener("click",()=>{
    let todo=input.value.trim();
    if(!todo){
        return;
    }
    addTodo(todo);
});

function updateStatus(todo){
    let todoName=todo.parentElement.lastElementChild;
    const now = new Date();
    if(todo.checked){
        todoName.classList.add("checked");
        todosJson[todo.id].status="completed";
        todosJson[todo.id].completedOn = now;
    }else{
        todoName.classList.remove("checked");
        todosJson[todo.id].status="pending";
        todosJson[todo.id].completedOn = null; 
    }
    localStorage.setItem("todos",JSON.stringify(todosJson));
}

function remove(todo){
    const index=todo.dataset.index;
    todosJson.splice(index,1);
    showTodos();
    localStorage.setItem("todos",JSON.stringify(todosJson));
}

filters.forEach(function (el){
    el.addEventListener("click",(e)=>{
      if(el.classList.contains('active')){
        el.classList.remove('active');
        filter='';
      }else{
        filters.forEach(tag=>tag.classList.remove('active'));
        el.classList.add('active');
        filter=e.target.dataset.filter;
      }
      showTodos();
    });
});

deleteAllButton.addEventListener("click",()=>{
    todosJson=[];
    localStorage.setItem("todos",JSON.stringify(todosJson));
    showTodos();
});


