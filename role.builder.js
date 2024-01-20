function refuel(creep){
    var energyStores = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity();
    }
    });

    if(energyStores.length > 0){
        var response = creep.withdraw(energyStores[0], RESOURCE_ENERGY);
        if(response == ERR_NOT_IN_RANGE) {
          creep.moveTo(energyStores[0]);
        }    
    }
}

var roleBuilder = {
    
    //rework the builder class. This creep should have several actions.
    /*
        0) When towers don't exist and things need repaired, and those things have less than 75% health stop all actions and repair them.
        1) When towers aren't full stop all actions and transport energy to them.
        2) When towers are full and there are thing to build, gather energy and build them.
        3) When towers are full and there is nothing to build gather energy and transport it to storage.
    
    
    */
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        var spawnName = "Home"
        
        var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

        const repairtargets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        if(creep.memory.building != 'building' && target != undefined && creep.store[RESOURCE_ENERGY] > 0) {
            creep.memory.building = 'building';
            creep.say('🚧 build');
        }
        
        if(creep.memory.building == 'building' && creep.store[RESOURCE_ENERGY] == 0){
            creep.moveTo(towers[0]);
        }

        //need to find closest repair target
        
        if(creep.memory.building != 'repairing' && repairtargets.length > 0 && towers.length == 0 && repairtargets[0].structureType != STRUCTURE_WALL){
            creep.memory.building = 'repairing';
            creep.say('🔄 repair');

            repairtargets.sort((a,b) => a.hits - b.hits);

            if(repairtargets.length > 0) {
                creep.memory.building = 'repairing';
            }
        }
        
        if(creep.memory.building != 'harvesting' && creep.store[RESOURCE_ENERGY] == 0 && Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .9) {
            creep.memory.building = 'harvesting';
            creep.say('🔄 harvest');
        }
        


        if(creep.memory.building == 'building') {
            
            //Take energy from the spawn if there is extra space in the extensions and spawn is almost full
            
            if(target != undefined) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else if(creep.store.getFreeCapacity() == 0){
                var spawnSpots = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_SPAWN }
                });
                creep.moveTo((spawnSpots[0].pos.x + 1, spawnSpots[0].pos.y), {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }
        if(creep.memory.building == 'harvesting') {
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            var energyStores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity();
                }
            });
            
            if(energyStores.length > 0 && harvesters.length >= 2){
                var response = creep.withdraw(energyStores[0], RESOURCE_ENERGY);
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
        
        if(towers.length > 0){
            if(towers[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                var response = creep.transfer(towers[0], RESOURCE_ENERGY);
                if(response == ERR_NOT_IN_RANGE) {
                  creep.moveTo(towers[0]);
                }   
            }
        }
    }
};

module.exports = roleBuilder;