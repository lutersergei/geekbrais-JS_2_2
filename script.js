window.onload = function()
{
    var user_roles = [{id: 10, title: "Админ"},{id: 20, title: "Пользователь"}];

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

    var edit_buttons = document.querySelectorAll(".btn-edit");
    for(var i = 0;i < edit_buttons.length; i++)
    {
        edit_buttons[i].onclick = editUser;
    }

    function editUser() {
        var that = this;
        var table_row = this.parentElement.parentElement;
        var user = {};

        //Скрываем кнопки удаления/редактирования
        table_row.querySelector('.btn-edit').classList.add('hidden');
        table_row.querySelector('.btn-delete').classList.add('hidden');

        //Кнопки ОК/Отмена
        var button_ok = document.createElement('button');
        button_ok.classList.add('btn','btn-sm','btn-success','btn-ok');
        var icon_ok = document.createElement('span');
        icon_ok.classList.add('glyphicon', 'glyphicon-ok');
        button_ok.appendChild(icon_ok);
        var button_cancel =  document.createElement('button');
        button_cancel.classList.add('btn','btn-sm','btn-warning','btn-cancel');
        var icon_cancel = document.createElement('span');
        icon_cancel.classList.add('glyphicon', 'glyphicon-remove');
        button_cancel.appendChild(icon_cancel);
//            console.log(table_row.lastChild);
        table_row.lastElementChild.appendChild(button_ok);
        table_row.lastElementChild.appendChild(button_cancel);

        console.log(table_row);
        //Редактирование логина
        var username = table_row.querySelector("[data-type=username]");
        user.username = username.innerHTML;
        username.innerHTML = '';
        var input = document.createElement('input');
        input.value = user.username;
        username.appendChild(input);

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
        input = document.createElement('input');
        input.value = user.email;
        email.appendChild(input);

        //Редактирование активности
        var activity = table_row.querySelector("[data-type=activity]");
        user.activity = activity.getAttribute('data-active');
        input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        activity.innerHTML = 'Активен';
        if (activity.getAttribute('data-active') == 1)
        {
            input.setAttribute('checked', 'checked');
        }
        activity.insertBefore(input, activity.firstChild);


        console.log(user);
    }

    //Создание пользователя
    document.querySelector(".btn-new").onclick = function() {
        //Сбор параметров пользователя
        var username = document.getElementById("username").value;
        var role = document.getElementById("role").value;
        var email = document.getElementById("email").value;
        var active;
        if (document.getElementById("active_flag").checked)
        {
            active = 1;
        }
        else
        {
            active = 0;
        }

        //AJAX
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'new.php?username='+username +'&role=' + role + '&email=' + email + '&active=' + active, true);

        xhr.send(); // (1)

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            var response = JSON.parse(xhr.responseText);

            if (response.status === 'ok')
            {
                var row = document.createElement('tr');

                var td = document.createElement('td');
                td.setAttribute('data-type', 'id');
                td.innerHTML = response.id;

                row.appendChild(td);

                td = document.createElement('td');
                td.setAttribute('data-type', 'username');
                td.innerHTML = username;

                row.appendChild(td);

                td = document.createElement('td');
                td.setAttribute('data-type', 'role');
                var user_role = 'n/a';
                for(var i = 0; i<user_roles.length;i++)
                {
                    if (user_roles[i].id === +(role))
                    {
                        user_role = user_roles[i].title;
                        break;
                    }
                }
                td.innerHTML = user_role;

                row.appendChild(td);

                td = document.createElement('td');
                td.setAttribute('data-type', 'email');
                td.innerHTML = email;

                row.appendChild(td);

                td = document.createElement('td');
                td.setAttribute('data-type', 'activity');
                if (active === 1)
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
                edit_btn.setAttribute('data-id',response.id);
                edit_btn.onclick = editUser;
                var icon_edit = document.createElement('span');
                icon_edit.classList.add('glyphicon', 'glyphicon-edit');
                edit_btn.appendChild(icon_edit);
                td.appendChild(edit_btn);

                row.appendChild(td);

                var delete_btn =  document.createElement('button');
                delete_btn.classList.add('btn','btn-sm','btn-danger','btn-delete');
                delete_btn.setAttribute('type','button');
                delete_btn.setAttribute('data-id',response.id);
                delete_btn.onclick = confirmDeleteUser;
                var icon_delete = document.createElement('span');
                icon_delete.classList.add('glyphicon', 'glyphicon-trash');
                delete_btn.appendChild(icon_delete);
                td.appendChild(delete_btn);

                row.appendChild(td);

                document.querySelector('#users-table tbody').appendChild(row);
            }
        }
    }
};