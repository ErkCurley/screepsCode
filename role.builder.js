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
        
        var energyStores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store[RESOURCE_ENERGY] >= creep.store.getCapacity();
        }
        });
        var totalEnergyCap = 0;
        var storedEnergy = 0;
        var spawnHasEnergy = false;
        
        
        for(i in energyStores){
            totalEnergyCap = energyStores[i].store.getCapacity(RESOURCE_ENERGY)
            storedEnergy = energyStores[i].store.getUsedCapacity(RESOURCE_ENERGY)
        }
        
        if(storedEnergy > totalEnergyCap * .5){
            spawnHasEnergy = true
        }
        
        
        
        if(creep.memory.building != 'store' && towers.length > 0 && towers[0].store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.building = 'store';
            creep.say('🏦 store');
        }
        
        if(creep.memory.building != 'building' && target != undefined && spawnHasEnergy == true) {
            creep.memory.building = 'building';
            creep.say('🚧 build');
        }
        
        if(creep.memory.building != 'filling' && towers.length > 0 && towers[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0){
            creep.memory.building = 'filling';
            creep.say('⛽ fill');
        }
        
        if(creep.memory.building != 'repairing' && repairtargets.length > 0 && towers.length == 0 && repairtargets[0].structureType != STRUCTURE_WALL){
            creep.memory.building = 'repairing';
            creep.say('🔄 repair');
        }
        
        //ACTIONS
        if(creep.memory.building == 'repairing') {
            
            if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY) * .5){
                refuel(creep)
            }
            
            if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairtargets[0]);
            }
        }
        
        
        if(creep.memory.building == 'filling') {
            if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY) * .5){
                refuel(creep)
            }
        
            for(i in towers){
                if(towers[i].store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                    var response = creep.transfer(towers[i], RESOURCE_ENERGY);
                    if(response == ERR_NOT_IN_RANGE) {
                      creep.moveTo(towers[i]);
                    } 
                }
            }
        }

        if(creep.memory.building == 'building') {
            if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY) * .5 && spawnHasEnergy == true){
                refuel(creep)
            }
            
            if(target != undefined) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;