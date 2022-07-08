function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}


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
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length == 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
            
            if(targets.length > 0) {
                }else{
                    creep.moveTo(Game.spawns[spawnName]);
                }
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;