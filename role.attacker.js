var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.target == undefined || Game.getObjectById(creep.memory.target.id) == undefined){
            creep.memory.target = undefined
        }
        
        if(creep.memory.activity == undefined){
            creep.memory.activity = "Idle"
            creep.say('🔨 Idle');
        }
        
        targetFlag = Game.flags.AttackPoint
        if (targetFlag != undefined){
            creep.memory.activity = "Moving";
            // creep.say('🌲 Moving');
        }else{
            creep.memory.activity = "Idle"
        }
        
        
        
        hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
        hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES)
        if (hostiles.length > 0 || hostileStructures.length > 0){
            creep.memory.activity = "Attacking"
        }
        
        if(creep.memory.activity == "Attacking" && hostiles.length == 0 && hostileStructures.length == 0){
            creep.memory.activity = "Idle"
        }
        
        
        
        if(creep.memory.activity == "Idle"){
            //Not sure what to do here.
        }
  
        if(creep.memory.activity == "Moving") {
            creep.moveTo(targetFlag, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        
        if(creep.memory.activity == "Attacking") {
            
            if(creep.memory.target == undefined && hostiles.length > 0){
                creep.memory.target = hostiles[0];
            }else if (creep.memory.target == undefined && hostileStructures.length > 0){
                if(hostileStructures[0] == creep.room.controller && hostileStructures.length > 1){
                    creep.memory.target = hostileStructures[1]
                }else if (hostileStructures[0] != creep.room.controller && hostileStructures.length == 1){
                    creep.memory.target = hostileStructures[0]    
                }
            }
            
            if(creep.rangedAttack(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
                creep.say("Pew");
                creep.moveTo(Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    }
};

module.exports = roleAttacker;