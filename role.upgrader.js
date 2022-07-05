var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.upgrading == undefined){
            creep.memory.upgrading = true
            creep.say('🔨 upgrade');
        }
        
        if (creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.upgrading = false;
            creep.say('🌲 harvest');
        }
        
        if (creep.store.getFreeCapacity() == 0){
            creep.memory.upgrading = true
        }
        
        if(creep.memory.upgrading == false){
            var sources = creep.room.find(FIND_SOURCES);
            for (let i = 0; i < sources.length; i++) {
                if(sources[i].id == creep.memory.sourceTarget.id){
                    if(creep.harvest(sources[i]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[i], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
  
        if(creep.memory.upgrading == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;