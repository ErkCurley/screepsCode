var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.upgrading == undefined){
            creep.memory.upgrading = true
            creep.say('🔨 upgrade');
        }
        
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.upgrading = false;
            creep.say('🌲 harvest');
        }
        
        if (creep.store.getFreeCapacity() == 0){
            creep.memory.upgrading = true
        }
        
        if(creep.memory.upgrading == false){
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
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