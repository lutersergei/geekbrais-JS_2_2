window.onload = function()
{
    var user_roles = [{id: 10, title: "Админ"},{id: 20, title: "Пользователь"}];

    getUsers();

    function getUsers() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'users.php', true);

        xhr.send(); // (1)

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            var response = JSON.parse(xhr.responseText);

            console.log(response);
            if (response.status === 'ok')
            {
                // var user = new User('#table_body', response.users)
                for (var i=0; i<response.users.length; i++)
                {
                    var user = new AddUser('#table_body', response.users[i])
                }
            }
        }
    }

    function AddUser(selector, options) {
        var container = document.querySelector(selector);
        var row = document.createElement('tr');

        var td = document.createElement('td');
        td.setAttribute('data-type', 'id');
        td.innerHTML = options.id;

        row.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('data-type', 'username');
        td.innerHTML = options.username;

        row.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('data-type', 'role');
        var user_role = 'n/a';
        for(var i = 0; i<user_roles.length;i++)
        {
            if (user_roles[i].id === +(options.role))
            {
                user_role = user_roles[i].title;
                break;
            }
        }
        td.innerHTML = user_role;

        row.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('data-type', 'email');
        td.innerHTML = options.email;

        row.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('data-type', 'activity');
        if (+options.active === 1)
        {
            td.setAttribute('data-active', '1');
            td.innerHTML = "Активен";
        }
        else
        {
            td.setAttribute('data-active', '0');
            td.innerHTML = "Неактивен";
        }

        row.appendChild(td);

        td = document.createElement('td');

        var edit_btn =  document.createElement('button');
        edit_btn.classList.add('btn','btn-sm','btn-edit','btn-primary');
        edit_btn.setAttribute('type','button');
        edit_btn.setAttribute('data-id',options.id);
        edit_btn.onclick = editUser;
        var icon_edit = document.createElement('span');
        icon_edit.classList.add('glyphicon', 'glyphicon-edit');
        edit_btn.appendChild(icon_edit);
        td.appendChild(edit_btn);

        row.appendChild(td);

        var delete_btn =  document.createElement('button');
        delete_btn.classList.add('btn','btn-sm','btn-danger','btn-delete');
        delete_btn.setAttribute('type','button');
        delete_btn.setAttribute('data-id',options.id);
        delete_btn.onclick = confirmDeleteUser;
        var icon_delete = document.createElement('span');
        icon_delete.classList.add('glyphicon', 'glyphicon-trash');
        var textElem = document.createTextNode(' ');
        td.appendChild(textElem);
        delete_btn.appendChild(icon_delete);
        td.appendChild(delete_btn);

        row.appendChild(td);

        container.appendChild(row);
    }

//Удаление пользователя
    var delete_buttons = document.querySelectorAll(".btn-delete");
    for(var i = 0;i < delete_buttons.length; i++)
    {
        delete_buttons[i].onclick = confirmDeleteUser;
    }

    function confirmDeleteUser()
    {
        var that = this;

        var result = confirm("Действительно удалить?");
        if (result) deleteUser();

        function deleteUser()
        {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', 'delete.txt?id='+that.getAttribute("data-id"), true);

            xhr.send(); // (1)

            xhr.onreadystatechange = function() { // (3)
                if (xhr.readyState != 4) return;

                var response = JSON.parse(xhr.responseText);

                if (response.status === 'ok')
                {
                    that.parentNode.parentNode.remove();
                }
            }
        }
    }

//Редактирование пользователя
    var edit_buttons = document.querySelectorAll(".btn-edit");
    for(var i = 0;i < edit_buttons.length; i++)
    {
        edit_buttons[i].onclick = editUser;
    }

    function editUser() {
        var edit_button = this;
        var table_row = this.parentElement.parentElement;
        var user = {};
        var user_edited = {};

        //Скрываем кнопки удаления/редактирования
        hideButtons();

        //Кнопки ОК/Отмена
        var button_ok = document.createElement('button');
        button_ok.classList.add('btn','btn-sm','btn-success','btn-ok');
        var icon_ok = document.createElement('span');
        icon_ok.classList.add('glyphicon', 'glyphicon-ok');
        button_ok.onclick = edit;
        button_ok.appendChild(icon_ok);
        var button_cancel =  document.createElement('button');
        button_cancel.classList.add('btn','btn-sm','btn-warning','btn-cancel');
        button_cancel.onclick = cancel;
        var icon_cancel = document.createElement('span');
        icon_cancel.classList.add('glyphicon', 'glyphicon-remove');
        button_cancel.appendChild(icon_cancel);
        var textElem = document.createTextNode(' ');
        table_row.lastElementChild.appendChild(button_ok);
        table_row.lastElementChild.appendChild(textElem);
        table_row.lastElementChild.appendChild(button_cancel);

        function hideButtons() {
            for(var i = 0;i < edit_buttons.length; i++)
            {
                edit_buttons[i].classList.add('hidden');
            }

            for(var i = 0;i < delete_buttons.length; i++)
            {
                delete_buttons[i].classList.add('hidden');
            }
        }

        function showButtons() {
            for(var i = 0;i < edit_buttons.length; i++)
            {
                edit_buttons[i].classList.remove('hidden');
            }
            for(var i = 0;i < delete_buttons.length; i++)
            {
                delete_buttons[i].classList.remove('hidden');
            }
        }

        function cancel() {
            input_username.remove();
            username.innerHTML = user.username;

            selector.remove();
            for(var i = 0; i<user_roles.length;i++)
            {
                if (user_roles[i].id === user.role)
                {
                    role.innerHTML =  user_roles[i].title;
                    break;
                }
            }

            input_email.remove();
            email.innerHTML = user.email;

            input_activity.remove();
            if (+user.activity === 1)
            {
                activity.innerHTML = 'Активен';
            }
            else activity.innerHTML = 'Неактивен';

            showButtons();

            this.previousElementSibling.remove();
            this.remove();
        }

        function edit() {
            user_edited.username = input_username.value;
            user_edited.role = +selector.value;
            user_edited.email = input_email.value;
            user_edited.activity = activity.getAttribute('data-active');
            console.log(user_edited);

            var xhr = new XMLHttpRequest();

            xhr.open('GET', 'edit.txt?id='+edit_button.getAttribute("data-id") + '&role=' + user_edited.role + '&email=' + user_edited.email + '&active=' + user_edited.activity, true);

            xhr.send();

            xhr.onreadystatechange = function() {
                // console.log(that);
                if (xhr.readyState != 4) return;

                var response = JSON.parse(xhr.responseText);

                if (response.status === 'ok')
                {
                    input_username.remove();
                    username.innerHTML = user_edited.username;

                    selector.remove();
                    for(var i = 0; i<user_roles.length;i++)
                    {
                        if (user_roles[i].id === user_edited.role)
                        {
                            role.innerHTML =  user_roles[i].title;
                            break;
                        }
                    }

                    input_email.remove();
                    email.innerHTML = user_edited.email;

                    input_activity.remove();
                    if (+user_edited.activity === 1)
                    {
                        activity.innerHTML = 'Активен';
                    }
                    else activity.innerHTML = 'Неактивен';

                    showButtons();

                    //Удаление кнопок редактирование/отмена
                    edit_button.parentElement.lastElementChild.remove();
                    edit_button.parentElement.lastElementChild.remove();
                }
            }
        }

        //Редактирование логина
        var username = table_row.querySelector("[data-type=username]");
        user.username = username.innerHTML;
        username.innerHTML = '';
        var input_username = document.createElement('input');
        input_username.value = user.username;
        username.appendChild(input_username);

        //Редактирование Роли
        var role = table_row.querySelector("[data-type=role]");
        for(var i = 0; i<user_roles.length;i++)
        {
            if (user_roles[i].title === role.innerHTML)
            {
                user.role = user_roles[i].id;
                break;
            }
        }
        role.innerHTML = '';

                //Создаем select из массива user_roles
        var selector = document.createElement('select');
        for(var i = 0; i<user_roles.length;i++)
        {
            var option = document.createElement('option');
            option.setAttribute('value', user_roles[i].id);
            if (user_roles[i].id === user.role)
            {
                option.setAttribute('selected', 'selected');
            }
            option.innerHTML = user_roles[i].title;
            selector.appendChild(option);
        }
        role.appendChild(selector);

        //Редактирование email
        var email = table_row.querySelector("[data-type=email]");
        user.email = email.innerHTML;
        email.innerHTML = '';
        var input_email = document.createElement('input');
        input_email.value = user.email;
        email.appendChild(input_email);

        //Редактирование активности
        var activity = table_row.querySelector("[data-type=activity]");
        user.activity = activity.getAttribute('data-active');
        var input_activity = document.createElement('input');
        input_activity.setAttribute('type', 'checkbox');
        activity.innerHTML = 'Активен';
        if (activity.getAttribute('data-active') == 1)
        {
            input_activity.setAttribute('checked', 'checked');
        }
        input_activity.onchange = function () {
            if (input_activity.checked)
            {
                activity.setAttribute('data-active', '1');
            }
            else
            {
                activity.setAttribute('data-active', '0');
            }
        };
        activity.insertBefore(input_activity, activity.firstChild);
    }

//Создание пользователя
    document.querySelector(".btn-new").onclick = function() {
        //Сбор параметров пользователя
        var user = {};
        user.username = document.getElementById("username").value;
        user.role = document.getElementById("role").value;
        user.email = document.getElementById("email").value;

        if (document.getElementById("active_flag").checked)
        {
            user.active = 1;
        }
        else
        {
            user.active = 0;
        }

        //AJAX
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'new.php?username='+user.username +'&role=' + user.role + '&email=' + user.email + '&active=' + user.active, true);

        xhr.send(); // (1)

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            var response = JSON.parse(xhr.responseText);

            if (response.status === 'ok')
            {
                user.id = response.id;
                var new_user = new AddUser('#table_body', user);
            }
        }
    }
};