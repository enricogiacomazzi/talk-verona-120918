

import * as template from './templates/app.html';
//import * as userTemplate from './templates/user.html';
import style from './style.scss';

export function drawTemplate(){
    document.write(template);
}

export function dioboia(){
        console.log('dioboia!');
}

export function drawUsers(users){
    const list = document.getElementById('users-list');
    list.innerHTML = '';
    for(const user of users){
        const li = document.createElement("LI");
        li.classList.add('list-group-item');
        li.classList.add('user');
        li.appendChild(document.createTextNode(user.name));
        li.setAttribute("onClick",`userClick.next(${user.id})`);
        //li.setAttribute("onClick",`alert(${user.id})`);
        list.appendChild(li);
    }

    //list.appendChild()
    //debugger;
} 