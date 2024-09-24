var spawnName = "Home"

var roleLinker = {
    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.memory.activity != 'mining' && creep.memory.activity != 'moving'){
            
            var links = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
            });
            
            var targetLink = ''
            var minCost = 100
            if(links.length > 0){
                for(link in links){
                    if(minCost > PathFinder.search(Game.getObjectById(creep.memory.sourceTarget.id).pos,links[link].pos).cost){
                        minCost = PathFinder.search(Game.getObjectById(creep.memory.sourceTarget.id).pos,links[link].pos).cost
                        targetLink = links[link]
                    }
                }
            }
            
            
            // console.log(targetLink.pos)
            // console.log(Game.getObjectById(creep.memory.sourceTarget.id).pos)
            
            var targetSource = Game.getObjectById(creep.memory.sourceTarget.id)
            var movetoX = 0
            var movetoY = 0
            
            
            console.log(targetLink.pos.x - targetSource.pos.x)
            console.log(targetLink.pos.y - targetSource.pos.y)
            
            if(targetLink.pos.x > targetSource.pos.x){
                movetoX = targetLink.pos.x - 1
                movetoY = targetLink.pos.y

            }

            if(targetLink.pos.x < targetSource.pos.x){
                movetoX = targetLink.pos.x + 1
                movetoY = targetLink.pos.y
            }
            
            if(targetLink.pos.x == targetSource.pos.x){
                movetoX = targetLink.pos.x - 1
                movetoY = targetLink.pos.y

            }
            
            if(targetLink.pos.y > targetSource.pos.y){
                movetoX = targetLink.pos.x
                movetoY = targetLink.pos.y - 1

            }

            if(targetLink.pos.y < targetSource.pos.y){
                movetoX = targetLink.pos.x
                movetoY = targetLink.pos.y + 1
            }
            
            if(targetLink.pos.y == targetSource.pos.y){
                movetoX = targetLink.pos.x
                movetoY = targetLink.pos.y - 1

            }
            
            
            // movetoX = targetLink.pos.x
            // movetoY = targetLink.pos.y
            
            creep.moveTo(movetoX, movetoY)
            creep.memory.activity = 'moving';
            
            creep.memory.targetX = movetoX
            creep.memory.targetY = movetoY
            creep.memory.targetStructure = targetLink.id
        }
        
        if(creep.memory.activity != 'mining' && creep.memory.activity == 'moving'){
            creep.moveTo(creep.memory.targetX, creep.memory.targetY)
            if(creep.pos.x == creep.memory.targetX && creep.pos.y == creep.memory.targetY){
                creep.memory.activity = "mining"
            }
        }
        
        if(creep.memory.activity == 'mining'){
            if(creep.store.getFreeCapacity() == 0){
                creep.transfer(Game.getObjectById(creep.memory.targetStructure),RESOURCE_ENERGY)
            }
            creep.harvest(Game.getObjectById(creep.memory.sourceTarget.id))
        }
        

        
        // if(creep.memory.activity == 'harvesting') {
        //     if(creep.harvest(Game.getObjectById(creep.memory.sourceTarget.id)) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(Game.getObjectById(creep.memory.sourceTarget.id), {visualizePathStyle: {stroke: '#ffaa00'}});
        //     }
        // }
        
        // if(creep.memory.activity == 'delivery'){
        //     var targets = creep.room.find(FIND_STRUCTURES, {
        //         filter: (structure) => {
        //             return (structure.structureType == STRUCTURE_SPAWN ||
        //                 structure.structureType == STRUCTURE_EXTENSION) && //structure.structureType == STRUCTURE_TOWER) &&
        //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //         }
        //     });
            
        //     if(targets.length == 0) {
        //         var containers = creep.room.find(FIND_STRUCTURES, {
        //             filter: (structure) => {
        //                 return (structure.structureType == STRUCTURE_CONTAINER) &&
        //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //             }
        //         });
                
        //         // if(containers.length > 0){
        //         //     if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //         //         creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
        //         //     }
        //         // }else{
        //         //     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         //         creep.moveTo(creep.room.controller);
        //         //     }
        //         // }
                
                
        //     }else{
        //         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     }
        // }
    }
};

module.exports = roleLinker;