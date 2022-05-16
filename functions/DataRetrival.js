const ref = require('./reference')
const express = require('express');
const router = express.Router();
var firebase = require('./configuration')
var userData = require('./UserData')
var AssetTrackMovable = ref.assetTrackMovable
var AssetDataMovable
AssetTrackMovable.on('value',function(snap){
    var user = snap.val()
    var dateTime1=[]
    var Reader1=[]
    var Signal1=[]
    var Tag1=[]
    var keys = Object.keys(user)
    for(k=0;k<keys.length;k++){
        var keys2 = Object.keys(user[keys[k]].Records)
        for(i=0;i<keys2.length;i++){
            Tag1.push(user[keys[k]].Tag)
            dateTime1.push(user[keys[k]].Records[keys2[i]].DateTime)
            Reader1.push(user[keys[k]].Records[keys2[i]].Reader)
            Signal1.push(user[keys[k]].Records[keys2[i]].Signal)
        } 
    }
    AssetDataMovable = {
        tag : Tag1,
        datetime : dateTime1,
        gateway : Reader1,
        signal : Signal1
    }
},function(err){
    console.log(err)
})


router.get('/assetTracking',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            var present = user.email
            return response.render('assetTracking',{ assettrackdata : AssetDataMovable, presents : present,admin: userData.admin[i]})
        }
        else{
            return response.redirect('../../')
        }
    })
})

var BMSTrack = ref.bmsTrack
var BMSData
BMSTrack.on('value',function(snap){
    var user =snap.val()
    var Node1=[]
    var DateTime1=[]
    var Gateway1=[]
    var AmbientLight1=[]
    var RelativeHumidity1=[]
    var Tempr1=[]
    var al_lower1=[];
    var al_upper1=[];
    var rh_lower1=[];
    var rh_upper1=[];
    var temp_lower1=[];
    var temp_upper1=[];
    var node_distinct1=[];
    var gateway_distinct1=[];
    var keys = Object.keys(user)
    for(var k=0;k<keys.length;k++){
        if(node_distinct1.length == 0){
            node_distinct1.push(user[keys[k]].Node)
        }
        else{
            for(var i=node_distinct1.length-1;i>=0;i--){
                if(user[keys[k]].Node< node_distinct1[i]){
                    node_distinct1[i+1] = node_distinct1[i]
                }
                else{
                    break
                }
            }
            node_distinct1[i+1] =user[keys[k]].Node
        }
        
        var keys2 = Object.keys(user[keys[k]].Records)
        for(var i=0;i<keys2.length;i++){
            var flag=0;
            Node1.push(user[keys[k]].Node)
            temp_lower1.push(user[keys[k]].temp_lower)
            temp_upper1.push(user[keys[k]].temp_upper)
            rh_lower1.push(user[keys[k]].rh_lower)
            rh_upper1.push(user[keys[k]].rh_upper)
            al_lower1.push(user[keys[k]].al_lower)
            al_upper1.push(user[keys[k]].al_upper)
            DateTime1.push(user[keys[k]].Records[keys2[i]].DateTime)
            Gateway1.push(user[keys[k]].Records[keys2[i]].Gateway)
            AmbientLight1.push(user[keys[k]].Records[keys2[i]].AmbientLight)
            RelativeHumidity1.push(user[keys[k]].Records[keys2[i]].RelativeHumidity)
            Tempr1.push(user[keys[k]].Records[keys2[i]].Temperature)
        
            if(gateway_distinct1.length == 0){
                gateway_distinct1.push(user[keys[k]].Records[keys2[i]].Gateway)
            }
            else{
                for(var j=0;j<gateway_distinct1.length;j++){
                    if(user[keys[k]].Records[keys2[i]].Gateway == gateway_distinct1[j]){
                        flag = 1
                        break
                    }
                }
                if(!flag){
                    for(var j=gateway_distinct1.length-1;j>=0;j--){
                        if(user[keys[k]].Records[keys2[i]].Gateway< gateway_distinct1[j]){
                            gateway_distinct1[j+1]=gateway_distinct1[j]
                        }
                        else{
                            break
                        }
                    }
                    gateway_distinct1[j+1]=user[keys[k]].Records[keys2[i]].Gateway
                }
            }
        } 
    }
    BMSData = {
        node:Node1,
        dateTime:DateTime1,
        gateway:Gateway1,
        ambientLight:AmbientLight1,
        relativeHumidity:RelativeHumidity1,
        temperature:Tempr1,
        temp_lower:temp_lower1,
        temp_upper:temp_upper1,
        al_lower:al_lower1,
        al_upper:al_upper1,
        rh_lower:rh_lower1,
        rh_upper:rh_upper1,
        node_distinct:node_distinct1,
        gateway_distinct:gateway_distinct1
    }
},function(err){
    console.log(err)
})

var BMSGateway =ref.bmsGateway
var bmsGateway
BMSGateway.on('value',function(snap){
    var user = snap.val()
    var gateway1 =[]
    var id1 = []
    var keys = Object.keys(user)
    for(k=0;k<keys.length;k++){
        gateway1.push(user[keys[k]].Gateway)
        id1.push(user[keys[k]].ID)
    }
    bmsGateway = {
        gateway:gateway1,
        id:id1
    }
},function(err){
    console.log(err)
})

router.get('/bms',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){        
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            var present = user.email
            return response.render('bms',{presents: present,bmsData :BMSData,admin:userData.admin[i] })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/bmsnodeParams',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            var node = request.query.node
            for(var i=0; i<BMSData.node.length;i++){
                if(BMSData.node[i] == node){
                    var temp_lower = BMSData.temp_lower[i]
                    var temp_upper = BMSData.temp_upper[i]
                    var al_lower = BMSData.al_lower[i]
                    var al_upper = BMSData.al_upper[i]
                    var rh_lower = BMSData.rh_lower[i]
                    var rh_upper = BMSData.rh_upper[i]
                    break;
                }
            }
            var presents = user.email
            var data ={
                node :node,
                temp_lower: temp_lower,
                temp_upper: temp_upper,
                al_lower: al_lower,
                rh_upper: rh_upper,
                rh_lower: rh_lower,
                al_upper:al_upper,
            }
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            } 
            return response.render('nodeConfiguration',{data,presents,admin:userData.admin[i]})
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/bmsNode',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{Node,TemperatureUpper,TemperatureLower,alUpper,alLower,rhUpper,rhLower} = request.body
            BMSTrack.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    if(snap.val()[keys[k]].Node == Node){
                        var usersref= BMSTrack.child(keys[k])
                        usersref.update({
                            'Node':Node,
                            'temp_lower':TemperatureLower,
                            'temp_upper':TemperatureUpper,
                            'al_lower':alLower,
                            'al_upper':alUpper,
                            'rh_lower':rhLower,
                            'rh_upper':rhUpper
                        })
                        break
                    }
                }
                return response.redirect('./bms')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/bmsTemperature',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{LowerLimitTemperature,UpperLimitTemperature} = request.body
            BMSTrack.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    var usersref= BMSTrack.child(keys[k])
                    usersref.update({
                        'temp_lower':LowerLimitTemperature,
                        'temp_upper':UpperLimitTemperature
                    })
                }
                return response.redirect('./bms')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})
router.post('/bmsRelativeHumidity',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{LowerLimitRelativeHumidity,UpperLimitRelativeHumidity} = request.body
            BMSTrack.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    var usersref= BMSTrack.child(keys[k])
                    usersref.update({
                        'rh_lower':LowerLimitRelativeHumidity,
                        'rh_upper':UpperLimitRelativeHumidity
                    })
                }
                return response.redirect('./bms')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/bmsAmbientLight',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{LowerLimitAmbientLight,UpperLimitAmbientLight} = request.body
            BMSTrack.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    var usersref= BMSTrack.child(keys[k])
                    usersref.update({
                        'al_lower':LowerLimitAmbientLight,
                        'al_upper':UpperLimitAmbientLight
                    })
                }
                return response.redirect('./bms')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/bmsgatewayParams',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            var gateway=request.query.gateway
            var id
            for(i=0;i<bmsGateway.gateway.length;i++){
                if(bmsGateway.gateway[i]==gateway){
                    id = bmsGateway.id[i]
                    break
                }
            }
            var data = {
                gateway:gateway,
                id:id
            }
            var presents = user.email
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            return response.render('bmsgatewayConfiguration',{data,presents,admin:userData.admin[i]})
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/bmsGateway',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{gateway,ID}= request.body
            BMSGateway.once('value',function(snap){
                var keys =Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    if(snap.val()[keys[k]].Gateway == gateway){
                        var usersref = BMSGateway.child(keys[k])
                        usersref.update({
                            'ID': ID
                        })
                        break
                    }
                }
                return response.redirect('./bms')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})
var AssetTrackImmovableGateway =ref.assetTrackImmovableGateway
var assettrackimmovableGateway
AssetTrackImmovableGateway.on('value',function(snap){
    var gateway1 =[]
    var id1 = []
    var keys = Object.keys(snap.val())
    for(k=0;k<keys.length;k++){
        gateway1.push(snap.val()[keys[k]].Gateway)
        id1.push(snap.val()[keys[k]].ID)
    }
    assettrackimmovableGateway = {
        gateway:gateway1,
        id:id1
    }    
},function(err){
    console.log(err)
})



var AssetTrackImmovable = ref.assetTrackImmovable
var AssetDataImmovable
AssetTrackImmovable.on('value',function(snap){
    var machine_distinct1=[];
    var gateway_distinct1=[];
    var keys = Object.keys(snap.val())
    var data = [{
        Machine:'',
        tooltemp_lower:'',
        tooltemp_upper:'',
        vibration_lower:'',
        vibration_upper:'',
        Records:{
            DateTime:[],
            Gateway:[],
            Location:[],
            LocationX:[],
            LocationY:[],
            Temperature:[],
            Vibration:[]
        }
    }]
    for(var k=0;k<keys.length;k++){
        if(machine_distinct1.length == 0){
            machine_distinct1.push(snap.val()[keys[k]].Machine)
        }
        else{
            for(var i=machine_distinct1.length;i>0;i--){
                if(snap.val()[keys[k]].Machine< machine_distinct1[i]){
                    machine_distinct1[i+1] = machine_distinct1[i]
                }
                else{
                    break
                }
            }
            machine_distinct1[i+1] =snap.val()[keys[k]].Machine
        }
        data[k].Machine=(snap.val()[keys[k]].Machine)
        data[k].tooltemp_lower=(snap.val()[keys[k]].tooltemp_lower)
        data[k].tooltemp_upper=(snap.val()[keys[k]].tooltemp_upper)
        data[k].vibration_lower=(snap.val()[keys[k]].vibration_lower)
        data[k].vibration_upper=(snap.val()[keys[k]].vibration_upper)
        var keys2 = Object.keys(snap.val()[keys[k]].Records)
        for(var i=0;i<keys2.length;i++){
            var flag =0
            data[k].Records.DateTime.push(snap.val()[keys[k]].Records[keys2[i]].DateTime)
            data[k].Records.Gateway.push(snap.val()[keys[k]].Records[keys2[i]].Gateway)
            data[k].Records.Location.push(snap.val()[keys[k]].Records[keys2[i]].Location)
            data[k].Records.LocationX.push(snap.val()[keys[k]].Records[keys2[i]].LocationX)
            data[k].Records.LocationY.push(snap.val()[keys[k]].Records[keys2[i]].LocationY)
            var Machine_Data = snap.val()[keys[k]].Records[keys2[i]].Machinedata
            var x = Machine_Data.split(",")
            for(var q=0;q<x.length;q++){
                var y = x[q].split("=")
                if(y[0] == "Temperature")
                    data[k].Records.Temperature.push(y[1])
                if(y[0] == "Vibration")
                    data[k].Records.Vibration.push(y[1])
            }    
        } 
    }
    for(var k in data){
        for(i=0;i<data[k].Records.Gateway.length;i++){
            var flag =0
            if(gateway_distinct1.length == 0){
                gateway_distinct1.push(data[k].Records.Gateway[i])
            }
            else{
                for(var j=0;j<gateway_distinct1.length;j++){
                    if(data[k].Records.Gateway[i] == gateway_distinct1[j]){
                        flag = 1
                        break
                    }
                }
                if(!flag){
                    for(var j=gateway_distinct1.length-1;j>=0;j--){
                        if(data[k].Records.Gateway[i]< gateway_distinct1[j]){
                            gateway_distinct1[j+1]=gateway_distinct1[j]
                        }
                        else{
                            break
                        }
                    }
                    gateway_distinct1[j+1]=data[k].Records.Gateway[i]
                }
            }
        }
    }
    AssetDataImmovable = {
        data:data,
        machine_distinct: machine_distinct1,
        gateway_distinct: gateway_distinct1
    }
},function(err){
    console.log(err)
})

router.get('/machineManagement',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            var present = user.email
                return response.render('machineManagement',{presents: present,assetData:AssetDataImmovable,admin:userData.admin[i] })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/assetMachineParams',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            var machine = request.query.machine
            for(var i=0; i<AssetDataImmovable.data.length;i++){
                if(AssetDataImmovable.data[i].Machine == machine){
                    var tooltemp_lower = AssetDataImmovable.data[i].tooltemp_lower
                    var tooltemp_upper = AssetDataImmovable.data[i].tooltemp_upper
                    var vibration_lower = AssetDataImmovable.data[i].vibration_lower
                    var vibration_upper = AssetDataImmovable.data[i].vibration_upper
                    break;
                }
            }
            var presents = user.email
            var data ={
                machine :machine,
                tooltemp_lower: tooltemp_lower,
                tooltemp_upper: tooltemp_upper,
                vibration_lower: vibration_lower,
                vibration_upper:vibration_upper
            }
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            } 
            return response.render('machineConfiguration',{data,presents,admin:userData.admin[i]})
        }
        else{
            return response.redirect('../../')
        }
    },function(err){
        console.log(err)
    })
})

router.post('/assetMachine',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{Machine,ToolTemperatureUpper,ToolTemperatureLower,VibrationUpper,VibrationLower} = request.body
            AssetTrackImmovable.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(var k=0;k<keys.length;k++){
                    if(snap.val()[keys[k]].Machine == Machine){
                        var usersref= AssetTrackImmovable.child(keys[k])
                        usersref.update({
                            'Machine':Machine,
                            'tooltemp_lower':ToolTemperatureLower,
                            'tooltemp_upper':ToolTemperatureUpper,
                            'vibration_lower':VibrationLower,
                            'vibration_upper':VibrationUpper
                        })
                        break
                    }
                }
                return response.redirect('./machineManagement')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/Machinetooltemp',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{LowerLimitTooltemp,UpperLimitTTooltemp} = request.body
            AssetTrackImmovable.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    var usersref= AssetTrackImmovable.child(keys[k])
                    usersref.update({
                        'tooltemp_lower':LowerLimitTooltemp,
                        'tooltemp_upper':UpperLimitTTooltemp
                    })
                }
                return response.redirect('./machineManagement')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})
router.post('/Machinevibration',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{LowerLimitVibration,UpperLimitVibration} = request.body
            AssetTrackImmovable.once('value',function(snap){
                var keys = Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    var usersref= AssetTrackImmovable.child(keys[k])
                    usersref.update({
                        'vibration_lower':LowerLimitVibration,
                        'vibration_upper':UpperLimitVibration
                    })
                }
                return response.redirect('./machineManagement')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })  
})


router.get('/assetgatewayParams',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            var gateway=request.query.gateway
            var id
            for(i=0;i<assettrackimmovableGateway.gateway.length;i++){
                if(assettrackimmovableGateway.gateway[i]==gateway){
                    id = assettrackimmovableGateway.id[i]
                    break
                }
            }
            var data = {
                gateway:gateway,
                id:id
            }
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            var presents= user.email
            return response.render('assetImmovablegatewayConfiguration',{data,presents,admin:userData.admin[i]})
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.post('/assetImmovableGateway',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            const{gateway,ID}= request.body
            AssetTrackImmovableGateway.once('value',function(snap){
                var keys =Object.keys(snap.val())
                for(k=0;k<keys.length;k++){
                    if(snap.val()[keys[k]].Gateway == gateway){
                        var usersref = AssetTrackImmovableGateway.child(keys[k])
                        usersref.update({
                            'ID': ID
                        })
                        break
                    }
                }
                return response.redirect('./machineManagement')
            },function(err){
                console.log(err)
            })
        }
        else{
            return response.redirect('../../')
        }
    })
})


router.get('/assetGraphs', (req, res) => {
    firebase.auth().onAuthStateChanged(function (user) { 
      if (user) {
        var present = user.email
        k = 0;
          DateTimex = [];
          ToolTemperaturex = [];
        for(var i = 0; i < AssetDataImmovable.data[0].Records.DateTime.length;i++){
          if((JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(1,11) === "2019-02-07") && ((JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(12,17) >= "19:00") && (JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(12,17) <= "21:00"))){
            DateTimex[k] = AssetDataImmovable.data[0].Records.DateTime[i];
            ToolTemperaturex[k] = AssetDataImmovable.data[0].Records.Temperature[i];
            k++;
        }
      }
      var x = {
          dateTime: DateTimex,
          tooltemperature: ToolTemperaturex,
          date: "2019-02-07",
          fromTime: "19:00" ,
          toTime: "21:00"
      }
      for(var i in userData.email){
        if(userData.email[i] == user.email){
                    break
        }
    }
        res.render('assetGraphs', {
          x,presents:present,admin:userData.admin[i]
        });
        console.log("User present");
  
      } else {
        console.log("User not present");
        res.redirect('../')
      }
    });
  });
  
  router.post('/showgraphs', (req, res) => {
    firebase.auth().onAuthStateChanged(function (user) {
  
      if (user) {
        var role
        var admin = false
        for(var i in userData.email){
            if(userData.email[i] == user.email){
                role = userData.role[i].split('#')
                for(var j in role){
                    if(role[j] == 'admin'){
                        admin =true 
                        break
                    }
                }        
                break 
            }
        }
        var present = user.email
            const { fieldType , date, fromTime , toTime , chartType } = req.body;
            chartt = chartType;
              k = 0;
                Gatewayx = [];
                DateTimex = [];
                Locationx = [];
                Machinex = [];
                LocationXx = [];
                LocationYx = [];
                Vibrationx = [];
                ToolTemperaturex = [];
              for(var i = 0; i < AssetDataImmovable.data[0].Records.DateTime.length;i++){
                if((JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(1,11) === date) && ((JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(12,17) >= fromTime) && (JSON.stringify(AssetDataImmovable.data[0].Records.DateTime[i]).substring(12,17) <= toTime))){
                  Gatewayx[k] = AssetDataImmovable.data[0].Records.Gateway[i];
                  DateTimex[k] = AssetDataImmovable.data[0].Records.DateTime[i];
                  Locationx[k] = AssetDataImmovable.data[0].Records.Location[i];
                  Machinex[k] = AssetDataImmovable.data[0].Machine;
                  LocationXx[k] = AssetDataImmovable.data[0].Records.LocationX[i];
                  LocationYx[k] = AssetDataImmovable.data[0].Records.LocationY[i];
                  Vibrationx[k] = AssetDataImmovable.data[0].Records.Vibration[i];
                  ToolTemperaturex[k] = AssetDataImmovable.data[0].Records.Temperature[i];
                  k++;
              }
              if(fieldType === "vibration")
              {
                graphdata = Vibrationx;
              }
  
              else
              {
                graphdata = ToolTemperaturex;
              }
            }
            var x = {
                gateway: Gatewayx,
                dateTime: DateTimex,
                location: Locationx,
                machine: Machinex,
                locationX: LocationXx,
                locationY: LocationYx,
                vibration: Vibrationx,
                tooltemperature: ToolTemperaturex,
                chart: chartt,
                fieldtype: fieldType,
                graphdata: graphdata,
                date: date,
                fromTime: fromTime ,
                toTime: toTime ,
                chartType: chartType
            }
            var x = {
                gateway: Gatewayx,
                dateTime: DateTimex,
                location: Locationx,
                machine: Machinex,
                locationX: LocationXx,
                locationY: LocationYx,
                vibration: Vibrationx,
                tooltemperature: ToolTemperaturex,
                chart: chartt,
                fieldtype: fieldType,
                graphdata: graphdata,
                date: date,
                fromTime: fromTime ,
                toTime: toTime ,
                chartType: chartType
            }
              res.render('dategraph', {
                x,presents:present,admin
              });
            }
            else {
              console.log("User not present");
              res.redirect('../')
            }
          });
  });

  router.get('/bmsGraphs', (req, res) => {
    firebase.auth().onAuthStateChanged(function (user) {
  
      if (user) {
        for(var i in userData.email){
            if(userData.email[i] == user.email){
                        break
            }
        }
        var present = user.email
        res.render('bmsGraphs', {
          BMSData,presents :present,admin:userData.admin[i]
        });
        console.log("User present");
  
      } else {
        console.log("User not present");
        res.redirect('../')
      }
    });
  });


  router.post('/showBMSgraphs', (req, res) => {
  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        var role
        var admin = false
        for(var i in userData.email){
            if(userData.email[i] == user.email){
                role = userData.role[i].split('#')
                for(var j in role){
                    if(role[j] == 'admin'){
                        admin =true 
                        break
                    }
                }        
                break 
            }
        }
        var present = user.email
          const { fieldType , date, fromTime , toTime , chartType } = req.body;
          l = 0;
          Gateway1y = [];
          Node1y = [];
          DateTime1y = [];
          Temperature1y = [];
          RelativeHumidity1y = [];
          AmbientLight1y = [];

          chartt = chartType;
            for(var i = 0; i < DateTime1.length;i++){
              if((JSON.stringify(BMSData.dateTime[i]).substring(1,11) === date) && ((JSON.stringify(BMSData.dateTime[i]).substring(12,17) >= fromTime) && (JSON.stringify(BMSData.dateTime[i]).substring(12,17) <= toTime))){

                Gateway1y[l] = BMSData.gateway[i];
                Node1y[l] = BMSData.node[i];
                DateTime1y[l] = BMSData.dateTime[i];
                Temperature1y[l] = BMSData.temperature[i];
                RelativeHumidity1y[l] = BMSData.relativeHumidity[i];
                AmbientLight1y[l] = BMSData.ambientLight[i];
                l++;
            }
          }


         if(fieldType === "relativeHumidity")
         {
           graphdata = RelativeHumidity1y;
         }

         else
         {
           graphdata = AmbientLight1y;
         }
          var y = {
              gateway: Gateway1y,
              node: Node1y,
              dateTime: DateTime1y,
              temperature: Temperature1y,
              relativeHumidity: RelativeHumidity1y,
              ambientLight: AmbientLight1y,
              chart: chartt,
              fieldtype: fieldType,
              graphdata: graphdata,
              date: date,
              fromTime: fromTime ,
              toTime: toTime ,
              chartType: chartType
          }
            res.render('./bmsdategraph', {
            y,presents:present,admin
            });
          }
          else {
            console.log("User not present");
            res.redirect('../')
          }
        });
});

  
module.exports = router