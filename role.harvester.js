var spawnName = "Home"

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const repairtargets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        if(creep.memory.activity != 'delivery' && creep.store.getFreeCapacity() == 0){
            creep.memory.activity = 'delivery';
            //creep.say('🔄 deliver');

        }
        
        if(creep.memory.activity == 'delivery' && creep.store[RESOURCE_ENERGY] != 0){
            creep.memory.activity = 'delivery';
            //creep.say('🔄 deliver');

        }
        
        if(creep.memory.activity != 'harvesting' && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.activity = 'harvesting';
            //creep.say('🔄 collect');
        }
        
        // if(creep.memory.activity != 'delivery' && creep.store.getFreeCapacity() > 0) {
        //     console.log("got here")
        //     creep.memory.activity = 'harvesting';
        //     creep.say('🔄 harvest');
        // }
        
        
        
        if(creep.memory.activity == 'harvesting') {
            if(creep.harvest(Game.getObjectById(creep.memory.sourceTarget.id)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceTarget.id), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
        if(creep.memory.activity == 'delivery'){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) && //structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length == 0) {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                
                // if(containers.length > 0){
                //     if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                //     }
                // }else{
                //     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(creep.room.controller);
                //     }
                // }
                
                
            }else{
                
                //find the nearest target and go there.
                if(targets.length > 0){
                    bestPath = 0;
                    shortestPath = 100;
                    for(i in targets){
                        current = PathFinder.search(creep.pos,targets[i].pos)
                        if(current.path.length < shortestPath){
                            shortestPath = current.path.length
                            bestPath = i
                        }
                    }
                    
                    if(creep.transfer(targets[bestPath], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[bestPath], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;