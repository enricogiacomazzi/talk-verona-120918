

import {demo} from './util';

export class BizLogic{

    constructor(){
        this.baseUrl = 'http://localhost:3000/';

        const search = document.getElementById('search');

        demo(this.baseUrl);
    }



    userClick(user){
        this.userClick$.next(user);
    }
}