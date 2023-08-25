import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';



const app = express ();

app.use(express.static('public'))

app.use(express.json());

const  db = await sqlite.open({
    filename:  './price_plan.db',
    driver:  sqlite3.Database
});

await db.migrate()


//Return a list of all available price plans

app.get('/api/price_plans', async function (req, res) {
   const getPlan = await getPricePlan();
    res.json ({
        getPlan: getPlan
    });
});

export async function getPricePlan () {
    const result = await db.all(`select * from price_plan`);
    return result;
}

// const result = await getPricePlan ()
// console.log(result)

//Create a new price plan

app.post('/api/price_plan/create', async (req, res) => {
    const plan_name = req.body.plan_name;
    const sms_price = req.body.sms_price;
    const call_price = req.body.call_price;

    const createPlan = await createPricePlan(plan_name, sms_price, call_price);
    
res.json({
    createPlan: createPlan,
    status: 'Sucess',
    message: `${plan_name} created successfully`,
})
});

export async function createPricePlan (plan_name, sms_price, call_price) {
    const sql = `insert into price_plan (plan_name, sms_price, call_price) values (?, ?, ?)`;
    await db.run(sql, [plan_name, sms_price, call_price])
    }
    
    // await createPricePlan("data 101", 5.50, 1.50)

//Calculate phonebill total

app.post('/api/phonebill', async(req, res) => {

    const price_plan_name = req.body.price_plan;

    const price_plan = await db.get(`SELECT id, plan_name, sms_price, call_price
    FROM price_plan WHERE plan_name = ?`, price_plan_name);

    if(!price_plan){
        res.json({
            error : `Invalid price plan name : ${price_plan_name}`
        });
    }else{

        const activity = req.body.actions;

    const activities = activity.split(",");

    let total = 0;

    activities.forEach(action => {
        if(action.trim() === 'sms') {
            total += price_plan.sms_price;
        }
        else if(action.trim() === 'call'){
            total += price_plan.call_price;
        }
    });
     
    res.json({
    
        total: `R${total.toFixed(2)}`
        

    });

    }
});

    //Update the price plan table
   
app.post('/api/price_plan/update', async function(req, res) {


    const plan_name = req.body.plan_name;
    const sms_price = req.body.sms_price;
    const call_price = req.body.call_price;


    await updatePricePlan(sms_price, call_price, plan_name);


res.json({
    status : 'Sucess',
    message: `The ${plan_name} was updated sucessfully`
})

});

export async function updatePricePlan (sms_price, call_price, plan_name) {
    const sql = `update price_plan set sms_price = ?, call_price = ? where plan_name = ?`;
    await db.run(sql, [sms_price, call_price, plan_name])
    }
    
    // await updatePricePlan ()
    // const result2 = await updatePricePlan().then(res=>{
    //      console.log(res);
    //  })

// Delete a price plan

app.post('/api/price_plan/delete', async (req, res) => {
    const id = req.body.id;
    await deletePricePlan(id);

    res.json ({
        status: 'Success',
        message: `${id} deleted sucessfully`
    })

})



export async function deletePricePlan (id) {
const sql = `delete from price_plan where id = ?`;
await db.run(sql, [id])
}

// await deletePricePlan(4);
// await deletePricePlan(5);
// await deletePricePlan(6);
// await deletePricePlan(7);

// const result1 = await deletePricePlan;
// console.log(result1)







const PORT = process.env.PORT || 4011;
app.listen(PORT, () => console.log (`Server started on port: ${PORT}`))