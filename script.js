let map = L.map('map');
let information = document.querySelector('.information ul');

map.on('mousedown',e=>{
    information.style.display = 'none';
})
map.on('blur',e=>{
    information.style = ""

})
map.setView([21.3891, 39.8579], 13);
let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
let apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544'
let tiles = L.tileLayer(tileUrl)
tiles.addTo(map)

let form = document.getElementById('formGetLocationByIp');
let bgWait = document.querySelector('.bg-disableClick');
form.addEventListener('submit',getMyLocation)

navigator.geolocation.getCurrentPosition( pos=>{
    L.marker([pos.coords.latitude,pos.coords.longitude],{
        title:"Your Location",
        riseOnHover:true
    }).addTo(map);
    map.setView([pos.coords.latitude,pos.coords.longitude], 13);
},err=>{
    console.log(err)
})


function getMyLocation(e){
    e.preventDefault();
    let val = e.target.ip.value;
    e.target.ip.value = "";
    if(!val){
        alert('Please Enter Value')
    }else{
        bgWait.classList.remove('hide')
        getLocationByIP(val);
    }
}

let [{children:[,ipaddress]},{children:[,position]},{children:[,timezone]},{children:[,isb]}] = information.children;

function getLocationByIP(ip){
    if(!ip)return;
    let abort = new AbortController();
    let  Signal=abort.signal;
    fetch('https://geo.ipify.org/api/v1?apiKey=at_LFItb88Tr9jD2khCVypZmC6LUQRpE&ipAddress='+ip,{
        signal:Signal,
    }).then(res=>{
        if(!res.ok){
            throw new Error(" Please Check if You are Enter Valid Ip")
            return
        }
        return res.json()
    })
    .then(data=>{
        L.marker([data.location.lat,data.location.lng],{
            title:data.location.city,
            riseOnHover:true
        }).addTo(map);
        bgWait.classList.add('hide')
        ipaddress.innerText=data.ip;
        position.innerHTML = data.location.city;
        isb.innerHTML = data.isp;
        timezone.innerHTML = data.location.timezone
        console.log(data.location)
        map.setView([data.location.lat,data.location.lng])
    }).catch(err=>{
        bgWait.classList.add('hide')

        if(!navigator.onLine){
            alert("Connect To Wi-Fi");
            return;
        }
        if(Signal.aborted){
            return;
        }
        alert(err)

    });
    setTimeout(()=>abort.abort(),20000)
}



// https://api.wheretheiss/v1/satellites/25544