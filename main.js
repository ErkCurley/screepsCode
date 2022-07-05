var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var spawnName = "Home"

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function buildRoads(){
    var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
    for (let i = 0; i < sources.length; i++) {
        var paths = PathFinder.search(Game.spawns[spawnName].pos,sources[i].pos);
        for (let i = 0; i < paths.path.length; i++) {
            Game.spawns[spawnName].room.createConstructionSite(paths.path[i], STRUCTURE_ROAD)
        }
    }
    
    var paths = PathFinder.search(Game.spawns[spawnName].pos,Game.spawns[spawnName].room.controller.pos);
    
    for (let i = 0; i < paths.path.length; i++) {
        Game.spawns[spawnName].room.createConstructionSite(paths.path[i], STRUCTURE_ROAD)
    }
}

function makeNewCreep(role,parts){
        var newName = role + Game.time;
        var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
        var target = getRndInteger(0,sources.length);
        console.log('Spawning new '+role+': ' + newName);
        Game.spawns[spawnName].spawnCreep(parts, newName,
            {memory: {role: role, sourceTarget: sources[target]}});
}



module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Ugraders: ' + upgraders.length);    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);
    
    const roads = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
    if(roads.length == 0){
        buildRoads()
    }
    
    
    if (Game.spawns[spawnName].room.controller.level >= 3){
        const towers = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
        
        const containers = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });
    
        if(towers.length > 0){
            var tower = towers[0];
        
            if(tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
        
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        } else {
            console.log("Creating Tower")
            const construction_sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES,{
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            if(construction_sites.length == 0){
                response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y + 1, STRUCTURE_TOWER);
                console.log(response)
            }
        }
    }
    
    if(harvesters.length == 4){
     const containers = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });
        if (containers.length < 5 && Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .9){
            // console.log("Creating Storage");
            const construction_sites = Game.spawns[spawnName].room.find(FIND_CONSTRUCTION_SITES,{
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            
            if(construction_sites.length == 0 && containers.length > 0){
                console.log("Trying to build container")
                var response =  Game.spawns[spawnName].room.createConstructionSite(constainers[containers.length - 1].pos.x + 1, constainers[containers.length - 1].pos.y, STRUCTURE_CONTAINER);
                // console.log(response)
            }else if (construction_sites.length == 0 && containers.length == 0){
                var response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y + 2, STRUCTURE_CONTAINER);
                // console.log(response)
            }
        }
        
        const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        if (extensions.length < 10 && Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .9){
            // console.log("Creating Extension");
            const construction_sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES,{
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
            if(construction_sites.length == 0 && extensions.length > 0){
                var response =  Game.spawns[spawnName].room.createConstructionSite(extensions[extensions.length - 1].pos.x - 1, extensions[extensions.length - 1].pos.y + 1, STRUCTURE_EXTENSION);
                // console.log(response)
            }else if (construction_sites.length == 0 && extensions.length == 0){
                var response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y, STRUCTURE_EXTENSION);
                // console.log(response)
            }
        }   
    }
    
    
    

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if(harvesters.length <= 1) {
        makeNewCreep('harvester',[WORK,CARRY,MOVE])
    }
    
    if(harvesters.length == 2) {
        makeNewCreep('harvester',[WORK,CARRY,CARRY,MOVE])
    }
    
    if(harvesters.length == 3) {
        makeNewCreep('harvester',[WORK,CARRY,CARRY,CARRY,MOVE])
    }
    
    if(harvesters.length >= 4 && harvesters.length < 6) {
        makeNewCreep('harvester',[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE])
    }

    if(upgraders.length < 3 && harvesters.length >= 2) {
        makeNewCreep('upgrader',[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE])
    }
    

    if(builders.length < 2 && harvesters.length >= 4) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    }

    if(Game.spawns[spawnName].spawning) {
        var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
        Game.spawns[spawnName].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawnName].pos.x + 1,
            Game.spawns[spawnName].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}