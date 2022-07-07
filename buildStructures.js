/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('buildStructures');
 * mod.thing == 'a thing'; // true
 */
 
 var spawnName = "Home"
 var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
//console.log('Harvesters: ' + harvesters.length);
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
//console.log('Ugraders: ' + upgraders.length);    
var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
//console.log('Builders: ' + builders.length);
 
 var buildStructures = {

    buildRoads: function (){
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
    },

    buildExtensions: function (){
        if(harvesters.length >= 1){
            
            const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
            const construction_sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES,{
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
            
            if (extensions.length < 8 && Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .9 && construction_sites.length == 0){
                if (Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if (Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if(Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if(Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y - 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if (Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if(Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y + 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if(Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }else if(Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 1, STRUCTURE_EXTENSION) == OK){
                    console.log("Creating Extension");
                }

            }   
        }
    },
    
    buildContainers: function (){
        if(harvesters.length >= 4){
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
                    var response =  Game.spawns[spawnName].room.createConstructionSite(containers[containers.length - 1].pos.x + 1, containers[containers.length - 1].pos.y, STRUCTURE_CONTAINER);
                    // console.log(response)
                }else if (construction_sites.length == 0 && containers.length == 0){
                    var response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y + 2, STRUCTURE_CONTAINER);
                    // console.log(response)
                }
            }
        }
        
    },
    
    buildTowers: function() {
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
                    response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 3, STRUCTURE_TOWER);
                    console.log(response)
                }
            }
        }
        
    }
}

module.exports = buildStructures;