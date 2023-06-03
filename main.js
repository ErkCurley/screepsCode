var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attacker');

var buildStructures = require('buildStructures')

var spawnName = "Home"

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getSpaceAroundSources(){
    var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
    const terrain = Game.map.getRoomTerrain(Game.spawns[spawnName].room.name);

    freeSpace = 0
    for(i in sources){
        
        // console.log(terrain.get(sources[i].pos.x,sources[i].pos.y));
        
        positions = []
        
        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y - 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y - 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y - 1, sources[i].pos.roomName))

        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y, sources[i].pos.roomName))
        
        positions.push(new RoomPosition(sources[i].pos.x - 1, sources[i].pos.y + 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x,     sources[i].pos.y + 1, sources[i].pos.roomName))
        positions.push(new RoomPosition(sources[i].pos.x + 1, sources[i].pos.y + 1, sources[i].pos.roomName))

        for(k in positions){
            switch(terrain.get(positions[k].x, positions[k].y)) {
                case TERRAIN_MASK_WALL:
                    break;
                case TERRAIN_MASK_SWAMP:
                    freeSpace += 1;
                    break;
                case 0:
                    freeSpace += 1;
                    break;
            }
        }
    }
    return freeSpace;
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
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    
    const roads = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
    
    const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
    if(roads.length == 0 && extensions.length > 2){
        buildStructures.buildRoads()
    }
    
    
    buildStructures.buildTowers();
    buildStructures.buildExtensions();
    // buildStructures.buildContainers();

    
    //Build Creeps
        //Build creeps might be better in its own sub module
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Create a script that checks the area around all the sources and doesn't make too many harvesters
    var idealHarvesters = getSpaceAroundSources()
        //Some sources can only be accessed from 1 spot thus creating traffic jams.
        //There should be some ideal number of harvesters based on this value
    
    //Do not call make new creeps if there isnt enough energy to make said creep
    if( Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .5 || harvesters.length < 1){
        if(harvesters.length <= idealHarvesters){
           if(harvesters.length <= 1) {
                makeNewCreep('harvester',[WORK,CARRY,MOVE])
            }
        
            if(harvesters.length == 2) {
                makeNewCreep('harvester',[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE])
            }
            
            if(harvesters.length == 3) {
                makeNewCreep('harvester',[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
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
            Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        }
        
        if(builders.length == 1 && harvesters.length >= 2) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE, MOVE, MOVE], newName,
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