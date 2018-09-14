

import {showSpinner, drawUsers, showDashboard, drawChart, showError, drawMeter} from './util';
import {
    fromEvent,
    Subject,
    combineLatest,
    of,
    interval,
    NEVER
} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {
    debounceTime,
    map,
    mapTo,
    mergeMap,
    startWith,
    merge,
    tap,
    share,
    filter, catchError, retry, switchMap, partition
} from "rxjs/operators";


export class BizLogic{

    constructor(){

        this.baseUrl = 'http://localhost:3000/';

        this.userClick$ = new Subject();

        const search = document.getElementById('search');

        const search$ = fromEvent(search, 'keyup').pipe(
            map(() => search.value),
            startWith(null)
        );

        const userRes$ = search$.pipe(
            debounceTime(300),
            map(x => x == null ? '' : `?search=${x}`),
            mergeMap(x => ajax.get(`${this.baseUrl}users${x}`).pipe(retry(3),catchError(() => of({error: true})))),
            share()
        );

        const users$ = userRes$.pipe(
            filter(x => x.error !== true),
            map(x => x.response),
            merge(search$.pipe(mapTo([])))
        );

        search$.pipe(
            mapTo(1),
            merge(userRes$.pipe(map(x => x.error === true ? 2 : 0)))
        ).subscribe(x => {
            showSpinner(x === 1);
            showError(x === 2);
        });


        const usersPlusClick$ = combineLatest(users$, this.userClick$, (users, selected) => {

            let finded = false;

            users.forEach(x => {
                x.active = x.id === selected;

                if(x.active){
                    finded = true;
                }
            });

            if(!finded && selected !== null){
                this.userClick$.next(null);
            }

            return users;
        });


        usersPlusClick$.subscribe(x => {
            drawUsers(x);
        });

        const selected$ = usersPlusClick$.pipe(
            map(x => x.find(z => z.active === true))
        );

        selected$.subscribe(x => {
            showDashboard(x !== undefined);
        });

        selected$.pipe(
            filter(x => x !== undefined),
            mergeMap(x => ajax.get(`${this.baseUrl}users/${x.id}`))
        ).subscribe(x => {
            drawChart(x.response);
        });

        selected$.pipe(
            switchMap(x => x === undefined ? NEVER : interval(1000).pipe(mapTo(x), startWith(x))),
            mergeMap(x => ajax.get(`${this.baseUrl}users/${x.id}/now`)),
        ).subscribe(x => {
            drawMeter(x.response);
        });

        this.userClick$.next(null);

    }

    userClick(user){
        this.userClick$.next(user);
    }
}