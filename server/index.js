
const port = 3000;


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');



let users = [];
const months = [];


const app = express();

app.use(cors());

app.use(bodyParser.json());


app.get('/users', async (req, res) => {
    const search = (req.query.search || '').toLowerCase();
    const filtered = search == null ? users : users.filter(x => x.name.toLowerCase().indexOf(search) >= 0);
    res.send(filtered.map(x => {
        return {
            id: x.id,
            name: x.name
        }
    }));
});

app.get('/users/:id', async (req, res) => {

    const user = users[parseInt(req.params.id) - 1];

    res.send({
        xLabels: months,
        series: user.series
    });
});


app.get('/users/:id/now', (req, res) => {

    const baseData = users[parseInt(req.params.id) - 1].maxVals;

    res.send({
        updated: moment().format("DD/MM/YY hh:mm:ss:SSS"),
        energy: Math.random() * baseData.energy,
        gas: Math.random() * baseData.gas,
        phone: Math.random() * baseData.phone
    });
});


app.listen(port, async () => {
    console.log(`server listening on port ${port}`);

    const res = await axios.get('https://jsonplaceholder.typicode.com/users');

    console.log("users downloaded");

    const start = moment().subtract(12,"months");

    for(let i = 0; i < 12; i++){
        months.push(start.add(1, "months").format("MMMM YY"));
    }

    console.log("period generated");

    const maxVals = require('./fakedata');

    users = res.data.map((x,i) => {
        return {
            id: x.id,
            name: x.name,
            maxVals: maxVals[i],
            series: [
                { name: "energy", data: []},
                { name: "gas", data: []},
                { name: "phone", data: []},
            ]
        }
    });

    for(const u of users){
        for(let i = 0; i < 12; i++){
            u.series[0].data.push(Math.random() * u.maxVals.energy);
            u.series[1].data.push(Math.random() * u.maxVals.gas);
            u.series[2].data.push(Math.random() * u.maxVals.phone);
        }
    }

    console.log("fake data generated");



})