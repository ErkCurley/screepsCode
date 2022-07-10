var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.activity == undefined){
            creep.memory.activity = "Idle"
            creep.say('🔨 Idle');
        }
        
        targetFlag = Game.flags.AttackPoint
        if (targetFlag != undefined){
            creep.memory.activity = "Moving";
            creep.say('🌲 Moving');
        }else{
            creep.memory.activity = "Idle"
        }
        
        
        
        hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
        if (hostiles.length > 0){
            creep.memory.activity = "Attacking"
        }
        
        if(creep.memory.activity == "Attacking" && hostiles.length == 0){
            creep.memory.activity = "Idle"
        }
        
        
        
        if(creep.memory.activity == "Idle"){
            //Not sure what to do here.
        }
  
        if(creep.memory.activity == "Moving") {
            creep.moveTo(targetFlag, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        
        if(creep.memory.activity == "Attacking") {
            if(creep.memory.target == undefined){
                creep.memory.target = hostiles[0];
            }
            
            if(creep.rangedAttack(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
                creep.say("Pew");
                creep.moveTo(Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    }
};

module.exports = roleAttacker;