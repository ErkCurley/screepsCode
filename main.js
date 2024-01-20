var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attacker');

var buildStructures = require('buildStructures')

var spawnName = "Home"

function controlTowers(){
    const towers = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_TOWER }
                });
    
    if(towers.length <= 0){
        return;
    }
    
    var tower = towers[0];

    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax * .75 //&& structure.owner == "ErkCurley"  
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(closestHostiles.length > 0) {
            tower.attack(closestHostiles[0]);
        }
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}


function getSpaceAroundSources(selected = undefined){
    var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
    const terrain = Game.map.getRoomTerrain(Game.spawns[spawnName].room.name);

    var freeSpace = 0;
    var freeSpacePos = '';
    for(i in sources){
        
        // console.log(terrain.get(sources[i].pos.x,sources[i].pos.y));
        
        var positions = [];
        
        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y - 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y - 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y - 1, sources[i].pos.roomName))

        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y, sources[i].pos.roomName))
        
        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y + 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y + 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y + 1, sources[i].pos.roomName))

        for(var k in positions){
            switch(terrain.get(positions[k].x, positions[k].y)) {
                case TERRAIN_MASK_WALL:
                    break;
                case TERRAIN_MASK_SWAMP:
                    freeSpace += 1;
                    if(selected == i){
                        freeSpacePos = positions[k];
                    }
                    break;
                case 0:
                    freeSpace += 1;
                    if(selected == i){
                        freeSpacePos = positions[k];
                    }
                    break;
            }
        }
    }
    
    if(selected == undefined){
        return freeSpace;
    }else{
        return freeSpacePos;
    }
    
}


function makeNewCreep(role,parts,sources){
    
        console.log("trying to spawn a:" + role)
        if (Game.spawns[spawnName].spawnCreep(parts, "test", {dryrun: true}) == ERR_NOT_ENOUGH_ENERGY){
            return
        }
    
    
        var newName = role + Game.time;
        var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
        var target = ''
        
        if(role == "upgrader"){
            target = Game.spawns[spawnName].room.memory.upgradeSource
        }
        
        if(role == "harvester"){
            target = Game.spawns[spawnName].room.memory.harvestSource
        }

        console.log('Spawning new '+role+': ' + newName + "Target: " + target);
        Game.spawns[spawnName].spawnCreep(
            parts, newName,{memory: {role: role, sourceTarget: target}});
}



module.exports.loop = function () {
    
    // if(Game.cpu.bucket >= 10000){
    //     Game.cpu.generatePixel()
    // }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Ugraders: ' + upgraders.length);    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
    var roomController = Game.spawns[spawnName].room.controller;
    
    const roads = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_ROAD }
            });
    
    const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });

    if (Game.spawns[spawnName].room.memory.linkedSources == undefined){
        Game.spawns[spawnName].room.memory.linkedSources = [];
    }
    
    if (Game.spawns[spawnName].room.memory.upgradeSorce == undefined){
        var shortestPath = ""
        var shortestPathLen = 1000
        for(i in sources){
            currentPath = Game.spawns[spawnName].room.findPath(sources[i].pos,roomController.pos).length
            if(currentPath < shortestPathLen){
                shortestPathLen = currentPath
                shortestPath = sources[i]
            }
        }
        Game.spawns[spawnName].room.memory.upgradeSource = shortestPath;
    }
    
    
    if (Game.spawns[spawnName].room.memory.harvestSource == undefined){
        var shortestPath = ""
        var shortestPathLen = 1000
        filteredList = []
        for(i in sources){
            if (sources[i].id != Game.spawns[spawnName].room.memory.upgradeSource.id){
                filteredList.push(sources[i])
            }
        }
        
        for(i in filteredList){
            currentPath = Game.spawns[spawnName].room.findPath(filteredList[i].pos,Game.spawns[spawnName].pos).length
            if(currentPath < shortestPathLen){
                shortestPathLen = currentPath
                shortestPath = filteredList[i]
            }
        }
        Game.spawns[spawnName].room.memory.harvestSource = shortestPath;
    }
    

    if(roads.length <= 10 && extensions.length > 2){
        buildStructures.buildRoads()
    }
    
    
    for(i in sources){
        var position = getSpaceAroundSources(i);
        buildStructures.buildLinks(position, sources[i].id);
    }
    

    buildStructures.buildLinks();
    buildStructures.buildTowers();
    buildStructures.buildExtensions();
    // buildStructures.buildContainers();
    
    controlTowers()

    
    //Build Creeps
        //Build creeps might be better in its own sub module
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Create a script that checks the area around all the sources and doesn't make too many harvesters
    var idealHarvesters = getSpaceAroundSources() + sources.length
        //Some sources can only be accessed from 1 spot thus creating traffic jams.
        //There should be some ideal number of harvesters based on this value
        //Refine the script that makes the number of ideal harvesters to also account for terrain that has added roads to access previously inaccessable sources
    
    //Do not call make new creeps if there isnt enough energy to make said creep
    //Actually use spawn creep dry run to determien if its possible to spawn a new creep
    if( Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .5 || harvesters.length <= 2){
        // console.log("Ideal Number of Harvesters: " + idealHarvesters)
        if(harvesters.length <= idealHarvesters){
           if(harvesters.length <= 1) {
                makeNewCreep('harvester',[WORK,CARRY,MOVE])
            }
        
            if(harvesters.length == 2) {
                makeNewCreep('harvester',[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
            }
            
            if(harvesters.length == 3) {
                makeNewCreep('harvester',[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE])
            } 
        }
        
        // if(harvesters.length >= 4 && harvesters.length < 6) {
        //     makeNewCreep('harvester',[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE])
        // }
        
        if(upgraders.length == 0 && harvesters.length >= 2) {
            makeNewCreep('upgrader',[WORK,CARRY,MOVE])
        }
    
        if(upgraders.length < 3 && upgraders.length >= 1  && harvesters.length >= 2) {
            makeNewCreep('upgrader',[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE])
        }
        
        if(extensions.length >= 5 && attackers.length < 4 && Game.flags.AttackPoint){
            makeNewCreep('attacker',[MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK])
        }
    
        if(builders.length < 1 && harvesters.length >= 2) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns[spawnName].spawnCreep([WORK,WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder', building: 'building'}});
        }
        
        if(builders.length == 1 && harvesters.length >= 2) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns[spawnName].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], newName,
                {memory: {role: 'builder', building: 'building'}});
        }
    
        if(Game.spawns[spawnName].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                {align: 'left', opacity: 0.8});
        }
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
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
    }
}