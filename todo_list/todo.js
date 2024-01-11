window.addEventListener('load', ()=>{
    const form = document.querySelector("#newTask");
    const input = document.querySelector("#newTaskInput");
    const list_el = document.querySelector("#tasks");

    //Adding current Date
    let dateToday = document.querySelector("#dateToday");
    let existingContent = dateToday.textContent;
    let today = new Date();
    
    let day = `${today.getDate() < 10 ? "0":""}${today.getDate()}`;
    let month = `${(today.getMonth()+1) < 10 ? "0":""}${today.getMonth()+1}`;
    let year = today.getFullYear();
    
    //Making Fnctionality
    dateToday.textContent = existingContent.replace("date", `${day}/${month}/${year}`);;


    form.addEventListener('submit', (e)=>{
       e.preventDefault();
       const task = input.value;

       if (!task) {
        alert("no task entered, cannot add to list!");
        return;
       }

       document.body.style.overflowX = "hidden";
       const task_el = document.createElement("div");
       task_el.classList.add("task");

       const task_content_el = document.createElement("div");
       task_content_el.classList.add("content");
       

       task_el.appendChild(task_content_el);

       const task_input_el = document.createElement("input");
       task_input_el.classList.add("text");
       task_input_el.type = "text";
       task_input_el.value = task;
       task_input_el.setAttribute("readonly", "readonly");

       task_content_el.appendChild(task_input_el);

       const task_actions_el = document.createElement("div");
       task_actions_el.classList.add("actions");

       const task_edit_el = document.createElement("button");
       task_edit_el.classList.add("edit");
       task_edit_el.innerHTML = "edit";

       const task_delete_el = document.createElement("button");
       task_delete_el.classList.add("delete");
       task_delete_el.innerHTML = "delete";

       task_actions_el.appendChild(task_edit_el);
       task_actions_el.appendChild(task_delete_el);

       task_el.appendChild(task_actions_el);

       list_el.appendChild(task_el);
       task_el.offsetHeight;
       task_el.style.transform = 'translateX(0)';

       input.value = "";

        task_edit_el.addEventListener('click', ()=>{
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
                console.log("else block");
            }
        })

        task_delete_el.addEventListener('click',()=>{
            list_el.removeChild(task_el);
        })

        // Re-enable scroll bars
        const transformValue = window.getComputedStyle(task_el).getPropertyValue('transform');
        if (list_el.offsetHeight > window.innerHeight) {
            document.body.style.overflow = '';
        }
    })

})