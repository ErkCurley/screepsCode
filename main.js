var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attacker');

var buildStructures = require('buildStructures')

var spawnName = "Home"

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
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
            
    if(roads.length == 0 && extensions.length > 4){
        buildStructures.buildRoads()
    }
    
    
    buildStructures.buildTowers();
    buildStructures.buildExtensions();
    // buildStructures.buildContainers();

    

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
    
    if(upgraders.length == 0 && harvesters.length >= 2) {
        makeNewCreep('upgrader',[WORK,CARRY,MOVE])
    }

    if(upgraders.length < 3 && upgraders.length >= 1  && harvesters.length >= 2) {
        makeNewCreep('upgrader',[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE])
    }
    
    if(extensions.length >= 5 && attackers.length < 4){
        makeNewCreep('attacker',[WORK,CARRY,MOVE,RANGED_ATTACK])
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