var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building != 'harvesting' && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = 'harvesting';
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building != 'building' && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = 'building';
            creep.say('🚧 build');
        }
        
        const repairtargets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        if(creep.memory.building != 'repairing' && creep.store.getFreeCapacity() == 0 && repairtargets.length > 0){
            creep.memory.building = 'repairing';
            creep.say('🔄 harvest');

            repairtargets.sort((a,b) => a.hits - b.hits);

            if(repairtargets.length > 0) {
                creep.memory.building = 'repairing';
            }
        }
        


        if(creep.memory.building == 'building') {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else if(creep.store.getFreeCapacity() == 0){
                var spawnSpots = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_SPAWN }
                });
                creep.moveTo((spawnSpots[0].pos.x + 1, spawnSpots[0].pos.y), {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }
        if(creep.memory.building == 'harvesting') {
            var energyStores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ) &&
                        structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity();
                }
            });
            
            if(energyStores.length > 0){
                response = creep.withdraw(energyStores[0], RESOURCE_ENERGY);
                if(response == ERR_NOT_IN_RANGE) {
                  creep.moveTo(energyStores[0]);
                }    
            }
            
        }
        if(creep.memory.building == 'repairing') {
            if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairtargets[0]);
            }
        }
    }
};

module.exports = roleBuilder;