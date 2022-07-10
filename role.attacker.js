var roleAttacker = {

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
            if(creep.harvest(Game.getObjectById(creep.memory.sourceTarget.id)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceTarget.id), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
  
        if(creep.memory.upgrading == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleAttacker;