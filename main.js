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
            filter: (structure) => structure.hits < structure.hitsMax
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

    freeSpace = 0;
    freeSpacePos = '';
    for(i in sources){
        
        // console.log(terrain.get(sources[i].pos.x,sources[i].pos.y));
        
        positions = [];
        
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



function makeNewCreep(role,parts){
    
        var newName = role + Game.time;
        
        //Make code for selecting the closest source to the room controller as the default one for the upgraders

        var allCreeps = Game.creeps
        var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
        counts = {}


        //Distribute Creeps to sources based on least used source in the room
        for(var i in sources){
            counts[sources[i].id] = 0;
        }
        
        for(var i in allCreeps) {
            if(allCreeps[i].memory.role == 'harvester' || allCreeps[i].memory.role == 'upgrader'){
                for(var k  in sources){
                    if(allCreeps[i].memory.sourceTarget.id == k) {
                        counts[k] += 1; 
                    }
                }
            }
        } 
        
        
        
        min = 100;
        minSource = '';
        for (i in counts){
            if(counts[i] <= min){
                minSource = i;
                min = counts[i];
            }
        }
        
        
        //*** Still not evenly distributing creepss
        // If ideal source identified then use that one otherwise use a random source
        // if (minSource == ''){
        //     var target = sources[getRndInteger(0,sources.length)];
        // }else{
        //     var targetID = _.filter(sources, (source) => source.id == minSource);
        //     // target = sources.indexOf(targetID);
        //     var target = _.filter(sources, (source) => source.id == minSource);
        // }
        
        var target = sources[getRndInteger(0,sources.length)];

        console.log('Spawning new '+role+': ' + newName + "Target: " + target);
        Game.spawns[spawnName].spawnCreep(parts, newName,
            {memory: {role: role, sourceTarget: target}});
}



module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Ugraders: ' + upgraders.length);    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    
    const roads = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_ROAD }
            });
    
    const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
    if(roads.length <= 10 && extensions.length > 2){
        buildStructures.buildRoads()
    }
    
    var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
    for(i in sources){
        position = getSpaceAroundSources(i)
        buildStructures.buildLinks(position);
    }
    
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
    var idealHarvesters = getSpaceAroundSources()
        //Some sources can only be accessed from 1 spot thus creating traffic jams.
        //There should be some ideal number of harvesters based on this value
    
    //Do not call make new creeps if there isnt enough energy to make said creep
    if( Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .5 || harvesters.length <= 2){
        // console.log(idealHarvesters)
        if(harvesters.length <= idealHarvesters){
           if(harvesters.length <= 1) {
                makeNewCreep('harvester',[WORK,CARRY,MOVE])
            }
        
            if(harvesters.length == 2) {
                makeNewCreep('harvester',[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
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
            Game.spawns[spawnName].spawnCreep([WORK,CARRY,CARRY, CARRY, MOVE], newName,
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