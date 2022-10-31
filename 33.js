;(function(){
    "use strict"

    // Armazenar o DOM em variáveis

    const ul = document.getElementById("todo-list")
    // const lis = ul.getElementsByTagName("li")
    const itemInput = document.getElementById("item-input")
    const todoAddForm = document.getElementById("todo-add")
    const lis = ul.getElementsByTagName("li")

    ul.addEventListener("click", clickedUl)

    function setNewData(){
        localStorage.setItem("tasks", JSON.stringify(arrTasks))
    }

    function getSavedData(){
        let tasksData = localStorage.getItem("tasks")
        tasksData = JSON.parse(tasksData)
        console.log(tasksData)
        
        return tasksData && tasksData.length ? tasksData : [
            {
                name: "Task 1",
                createdAt: Date.now(),
                completed: false
            }
        ]
    }



    var arrTasks = getSavedData() /*[
        {
            name: "Task 1",
            createdAt: Date.now(),
            completed: false
        }
    ]*/


    setNewData()

    function generateLiTask(obj){
        const li = document.createElement("li")
        li.className = "todo-item"
        const p = document.createElement("p")
        p.className = "task-name"
        p.textContent = obj.name

        const checkButton = document.createElement("button")
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")
        checkButton.className = "button-check"
        checkButton.innerHTML = "<i class='fas fa-check displayNone' data-action='checkButton'></i>"

        checkButton.setAttribute("data-action", "checkButton")
        editButton.setAttribute("data-action", "editButton")
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(checkButton)
        li.appendChild(p)

        editButton.className = "fas fa-edit"
        li.appendChild(editButton)

        let containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"
        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        containerEdit.appendChild(inputEdit)
        inputEdit.value = obj.name

        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Edit"
        containerEdit.appendChild(containerEditButton)
        containerEditButton.setAttribute("data-action", "containerEditButton")


        const cancelButton = document.createElement("button")
        cancelButton.className = "cancelButton"
        cancelButton.textContent = "Cancel"
        containerEdit.appendChild(cancelButton)
        cancelButton.setAttribute("data-action", "cancelButton")


        li.appendChild(containerEdit)

        deleteButton.classList.add("fas", "fa-trash-alt")
        li.appendChild(deleteButton)
    
        // addEventLi(li)
        return li
    }

    function renderTasks(){
        ul.innerHTML = ""
        arrTasks.forEach(task => {
            ul.appendChild(generateLiTask(task))
        });
    }

    function addTask(task){
        if(itemInput.value.length!==0)
        {
            arrTasks.push({
                name: task,
                createAt: Date.now(),
                completed: false
            })
            setNewData()
        }
        else{
            alert("Insira uma tarefa!")
        }
    }

    function clickedUl(e){
        const dataAction = e.target.getAttribute("data-action")
        if(!dataAction) return

        let currentLi = e.target

        while(currentLi.nodeName !== "LI"){
            currentLi = currentLi.parentElement
        }

        const currentLiIndex = [...lis].indexOf(currentLi)

        const actions = {
            editButton: function(){
                const editContainer = currentLi.querySelector(".editContainer");

                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });

                editContainer.style.display = "flex"

            },
            deleteButton: function(){
                arrTasks.splice(currentLiIndex, 1)
                renderTasks()
                // currentLi.remove()
                // currentLi.parentElement.removeChild(currentLi)
                setNewData()
            },
            containerEditButton: function(){
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },
            cancelButton: function(){
                currentLi.querySelector(".editContainer").removeAttribute("style")
                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            },
            checkButton: function(){
                arrTasks[currentLiIndex].completed = !(arrTasks[currentLiIndex].completed)
                if(arrTasks[currentLiIndex].completed){
                    currentLi.querySelector(".fa-check").classList.remove("displayNone")
                }else{
                    currentLi.querySelector(".fa-check").classList.add("displayNone")
                }
                setNewData()
            }
        }

        if(actions[dataAction]){
            actions[dataAction]()
        }
    }

    todoAddForm.addEventListener("submit", function(e){
        e.preventDefault()
        console.log(itemInput.value)    
        // ao trabalhar com eventos, não é interessante usar innerHTML
        //ul.innerHTML += `           
        //    <li class="todo-item">
        //      <p class="task-name">${itemInput.value}</p>
        //    </li>
        //`
        addTask(itemInput.value)
        renderTasks()
        itemInput.value = ""
        itemInput.focus()
    });
    renderTasks()
    
})()