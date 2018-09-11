
import Highcharts from 'highcharts';

let meter = undefined;


export function drawUsers(users){
    const list = document.getElementById('users-list');
    list.innerHTML = '';
    for(const user of users){
        const li = document.createElement("LI");
        li.classList.add('list-group-item');
        li.classList.add('user');
        li.appendChild(document.createTextNode(user.name));
        li.setAttribute("onClick",`app.userClick(${user.id})`);

        if(user.active === true){
            li.classList.add('selected');
        }

        list.appendChild(li);
    }
}

export function drawChart(data){
    const container =document.getElementById('chart');
    Highcharts.chart(container,{
        chart: {
            type: 'column'
        },
        title: {
            text: data.name
        },
        xAxis: {
            categories: data.labels,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Euro'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data.series
    });

}

export function drawMeter(data) {

    if(data == null){
        meter = undefined;
        return;
    }

    if(meter !== undefined){
        meter.update({series: data.data});
        return;
    }

    meter = Highcharts.chart('meter', {
        chart: {
            type: 'bar'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: [""],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'euro',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: data.data
    });
}


export function showSpinner(val) {
    document.getElementById('spinner').style.visibility = val ? "visible" : "collapse";
}

export function showError(val) {
    document.getElementById('error').style.visibility = val ? "visible" : "collapse";
}

export function showDashboard(val) {
    document.getElementById('dashboard').style.visibility = val ? "visible" : "hidden";
}

export async function demo(url){
    const users = await fetch(`${url}users`).then(x => x.json());
    drawUsers(users);
    const user = await fetch(`${url}users/${users[0].id}`).then(x => x.json());
    drawChart(user);
    // const meter = await fetch(`${url}users/${users[0].id}/now`).then(x => x.json());
    // drawMeter(meter);
}
