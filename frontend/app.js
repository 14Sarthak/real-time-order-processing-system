const API = "http://localhost:4401/api/orders";

const WS = "ws://localhost:4401/ws";

const socket = new WebSocket(WS);

/* ---------- FORM ---------- */

const orderForm = document.getElementById("orderForm");

const customerInput = document.getElementById("customerInput");

const restaurantInput = document.getElementById("restaurantInput");

const foodInput = document.getElementById("foodInput");

const amountInput = document.getElementById("amountInput");

/* ---------- ACTIVE ORDER ---------- */

const orderId = document.getElementById("orderId");

const customerName = document.getElementById("customerName");

const restaurantName = document.getElementById("restaurantName");

const driverName = document.getElementById("driverName");

const orderStatus = document.getElementById("orderStatus");

const progressFill = document.getElementById("progressFill");

/* ---------- LIVE TRACKING ---------- */

const bike = document.getElementById("bike");

const trackingText = document.getElementById("trackingText");

/* ---------- EVENT FLOW ---------- */

const flows = [

document.getElementById("flow1"),

document.getElementById("flow2"),

document.getElementById("flow3"),

document.getElementById("flow4"),

document.getElementById("flow5"),

];

/* ---------- TIMELINE ---------- */

const stages = [

document.getElementById("stage1"),

document.getElementById("stage2"),

document.getElementById("stage3"),

document.getElementById("stage4"),

document.getElementById("stage5"),

];

const stageMap = {

ORDER_PLACED:0,

ORDER_ACCEPTED:1,

DRIVER_ASSIGNED:2,

PICKED_UP:3,

DELIVERED:4,

};

/* ---------- STAGES ---------- */

function resetStages(){

stages.forEach((stage)=>{

stage.innerHTML = stage.innerHTML.replace("🟢","⚪");

});

}

function updateStage(status){

resetStages();

const index = stageMap[status];

if(index !== undefined){

stages[index].innerHTML = stages[index].innerHTML.replace("⚪","🟢");

}

}

/* ---------- LIVE TRACKING ---------- */

function updateBike(status){

const bikePosition = {

ORDER_PLACED:"18%",

ORDER_ACCEPTED:"35%",

DRIVER_ASSIGNED:"55%",

PICKED_UP:"75%",

DELIVERED:"88%",

};

const trackingMessage = {

ORDER_PLACED:"Order placed",

ORDER_ACCEPTED:"Restaurant preparing food",

DRIVER_ASSIGNED:"Driver assigned",

PICKED_UP:"Driver is on the way",

DELIVERED:"Order delivered",

};

bike.style.left = bikePosition[status];

trackingText.textContent = trackingMessage[status];

}

/* ---------- EVENT FLOW ---------- */

function updateFlow(status){

flows.forEach((box)=>{

box.classList.remove("pipeline-active");

});

if(status==="ORDER_PLACED"){

flows[0].classList.add("pipeline-active");

flows[1].classList.add("pipeline-active");

}

if(status==="ORDER_ACCEPTED"){

flows[0].classList.add("pipeline-active");

flows[1].classList.add("pipeline-active");

flows[2].classList.add("pipeline-active");

}

if(status==="DRIVER_ASSIGNED"){

flows[0].classList.add("pipeline-active");

flows[1].classList.add("pipeline-active");

flows[2].classList.add("pipeline-active");

flows[3].classList.add("pipeline-active");

}

if(status==="PICKED_UP"){

flows[0].classList.add("pipeline-active");

flows[1].classList.add("pipeline-active");

flows[2].classList.add("pipeline-active");

flows[3].classList.add("pipeline-active");

}

if(status==="DELIVERED"){

flows.forEach((box)=>{

box.classList.add("pipeline-active");

});

}

}

/* ---------- DASHBOARD ---------- */

function updateDashboard(order){

if(!order) return;

orderId.textContent = order.orderCode;

customerName.textContent = order.customerName;

restaurantName.textContent = order.restaurantName;

orderStatus.textContent = order.status;

progressFill.style.width = `${order.progress}%`;

if(order.driver){

driverName.textContent = `${order.driver.name} • ${order.driver.vehicle} • ${order.driver.distanceKm} km`;

}

updateStage(order.status);

updateBike(order.status);

updateFlow(order.status);

}

/* ---------- LOAD EXISTING ORDERS ---------- */

async function loadOrders(){

try{

const response = await fetch(API);

const data = await response.json();

if(data.orders.length){

updateDashboard(data.orders[data.orders.length-1]);

}

}

catch(error){

console.error(error);

}

}

/* ---------- PLACE ORDER ---------- */

orderForm.addEventListener("submit", async (e)=>{

e.preventDefault();

const payload = {

customerName: customerInput.value,

restaurantName: restaurantInput.value,

items:[foodInput.value],

amount:Number(amountInput.value),

};

try{

const response = await fetch(API,{

method:"POST",

headers:{

"Content-Type":"application/json",

},

body:JSON.stringify(payload),

});

if(!response.ok){

throw new Error("Cannot create order");

}

const data = await response.json();

updateDashboard(data.order);

orderForm.reset();

}

catch(error){

console.error(error);

alert(error.message);

}

});

/* ---------- WEBSOCKET ---------- */

socket.onopen = ()=>{

console.log("WebSocket connected");

};

socket.onmessage = (event)=>{

const data = JSON.parse(event.data);

console.log(data);

if(data.type==="CONNECTED"){

return;

}

if(data.order){

updateDashboard(data.order);

}

};

socket.onerror = ()=>{

console.log("WebSocket error");

};

/* ---------- START ---------- */

loadOrders();