/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('buildStructures');
 * mod.thing == 'a thing'; // true
 */
 
 var spawnName = "Home"
 var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
//console.log('Harvesters: ' + harvesters.length);
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
//console.log('Ugraders: ' + upgraders.length);    
var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
//console.log('Builders: ' + builders.length);
 

 
 var buildStructures = {
    
    buildRoads: function (){
        //Build Roads around the spawn and the extensions
        
        var sources = Game.spawns[spawnName].room.find(FIND_SOURCES);
        for (let i = 0; i < sources.length; i++) {
            var paths = PathFinder.search(Game.spawns[spawnName].pos,sources[i].pos);
            for (let i = 0; i < paths.path.length; i++) {
                Game.spawns[spawnName].room.createConstructionSite(paths.path[i], STRUCTURE_ROAD)
            }
            
            
            //Find the direction the spawn is from the soruce and place roads on that side.
            
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x + 1, sources[i].pos.y + 1, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x + 1, sources[i].pos.y, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x + 1, sources[i].pos.y - 1, STRUCTURE_ROAD)
            
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x, sources[i].pos.y + 1, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x, sources[i].pos.y, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x, sources[i].pos.y - 1, STRUCTURE_ROAD)
            
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x - 1, sources[i].pos.y + 1, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x - 1, sources[i].pos.y, STRUCTURE_ROAD)
            // Game.spawns[spawnName].room.createConstructionSite(sources[i].pos.x - 1, sources[i].pos.y - 1, STRUCTURE_ROAD)
        }
        
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y + 1, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y - 1, STRUCTURE_ROAD)
        
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y + 1, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 1, STRUCTURE_ROAD)
        
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y + 1, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y, STRUCTURE_ROAD)
        Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 1, STRUCTURE_ROAD)
        
        
        var paths = PathFinder.search(Game.spawns[spawnName].pos,Game.spawns[spawnName].room.controller.pos);
        
        for (let i = 0; i < paths.path.length; i++) {
            Game.spawns[spawnName].room.createConstructionSite(paths.path[i], STRUCTURE_ROAD)
        }
        
        var paths = PathFinder.search(Game.spawns[spawnName].room.memory.upgradeSource.pos,Game.spawns[spawnName].room.controller.pos);
        for (let i = 0; i < paths.path.length; i++) {
            Game.spawns[spawnName].room.createConstructionSite(paths.path[i], STRUCTURE_ROAD)
        }
        
    },

    buildExtensions: function (){
        const extensions = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        const construction_sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES,{
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        roomLevel = Game.spawns[spawnName].room.controller.level
        var spawnOffsetx = 0
        var spawnOffsety = 0
        
        if(roomLevel >= 2){
            spawnOffsetx = 3
            spawnOffsety = 0
            if (extensions.length < 5 && construction_sites < 5){
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx + 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx - 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety + 1, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety - 1, STRUCTURE_EXTENSION)
            }else{
                
            }
        }
        
        if(roomLevel >= 3){
            spawnOffsetx = 5
            spawnOffsety = -1
            if (extensions.length <= 5 && construction_sites == 0){
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx + 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx - 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety + 1, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety - 1, STRUCTURE_EXTENSION)
            }else{
                
            }
        }
        
        if(roomLevel >= 4){
            spawnOffsetx = 0
            spawnOffsety = -3
            if (extensions.length <= 10 && construction_sites == 0){
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx + 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx - 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety + 1, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety - 1, STRUCTURE_EXTENSION)
            }else{
                
            }
            
            spawnOffsetx = -2
            spawnOffsety = -4
            if (extensions.length <= 10 && construction_sites == 0){
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx + 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx - 1, Game.spawns[spawnName].pos.y - spawnOffsety, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety + 1, STRUCTURE_EXTENSION)
                Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - spawnOffsetx,     Game.spawns[spawnName].pos.y - spawnOffsety - 1, STRUCTURE_EXTENSION)
            }else{
                
            }
        }
    },
    
    buildContainers: function (){
        if(harvesters.length >= 4){
            const containers = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            if (containers.length < 5 && Game.spawns[spawnName].room.energyAvailable > Game.spawns[spawnName].room.energyCapacityAvailable * .9){
                // console.log("Creating Storage");
                const construction_sites = Game.spawns[spawnName].room.find(FIND_CONSTRUCTION_SITES,{
                    filter: { structureType: STRUCTURE_CONTAINER }
                });
                
                if(construction_sites.length == 0 && containers.length > 0){
                    console.log("Trying to build container")
                    var response =  Game.spawns[spawnName].room.createConstructionSite(containers[containers.length - 1].pos.x + 1, containers[containers.length - 1].pos.y, STRUCTURE_CONTAINER);
                    // console.log(response)
                }else if (construction_sites.length == 0 && containers.length == 0){
                    var response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y + 2, STRUCTURE_CONTAINER);
                    // console.log(response)
                }
            }
        }
        
    },
    
    buildTowers: function() {
        if (Game.spawns[spawnName].room.controller.level >= 3){
            const towers = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_TOWER }
                });

            if(towers.length <= 0){
                console.log("Creating Tower")
                const construction_sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES,{
                    filter: { structureType: STRUCTURE_TOWER }
                });
                
                if(construction_sites.length == 0){
                    var response =  Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 3, STRUCTURE_TOWER);
                    
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 4, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 3, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x - 1, Game.spawns[spawnName].pos.y - 2, STRUCTURE_ROAD)
                    
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 4, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 3, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x, Game.spawns[spawnName].pos.y - 2, STRUCTURE_ROAD)
                    
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y - 4, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y - 3, STRUCTURE_ROAD)
                    Game.spawns[spawnName].room.createConstructionSite(Game.spawns[spawnName].pos.x + 1, Game.spawns[spawnName].pos.y - 2, STRUCTURE_ROAD)
                }
                
            }
        }
    },
    
    
    //add the location of the link to the room memory rahter than finding it every time you spawn a new creep.
    buildLinks: function(position = undefined, sourceId = undefined) {
        if (Game.spawns[spawnName].room.controller.level >= 5){
            const links = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_LINK }
            });
            
            const sites = Game.spawns[spawnName].room.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: { structureType: STRUCTURE_LINK }
            });
                    
            if(links.length < 1 && sites.length < 1){
                var spawnBuilding = Game.spawns[spawnName]
                spawnPos = new RoomPosition(spawnBuilding.pos.x,spawnBuilding.pos.y + 1, spawnBuilding.pos.roomName);
                Game.spawns[spawnName].room.createConstructionSite(spawnPos.x, spawnPos.y, STRUCTURE_LINK);
                 
            }   
            
            // //First find nearest soruce and build a link there. Next check room level higher control levels and build coresponding links.
            
            if(links.length == 1 && position != undefined && sourceId != undefined){
                
                sources = Game.spawns[spawnName].room.memory.linkedSources
                if(sources == undefined){
                    sources = [];
                }
                if(sources.indexOf(sourceId) == -1){
                    Game.spawns[spawnName].room.createConstructionSite(position.x, position.y, STRUCTURE_LINK);
                    sources.push(sourceId)
                    Game.spawns[spawnName].room.memory.linkedSources = sources
                    Game.spawns[spawnName].room.memory.energyLinks = [];
                    Game.spawns[spawnName].room.memory.energyLinks.pos.x = position.x
                    Game.spawns[spawnName].room.memory.energyLinks.pos.y = position.y
                }
            }
        }
        
        // if (Game.spawns[spawnName].room.controller.level >= 5){
        //         if(Game.spawns[spawnName].room.createConstructionSite(position.x, position.y - 1, STRUCTURE_LINK)){
        //             console.log("Creating Link Below", position.x, position.y - 1);
        //         }else if(Game.spawns[spawnName].room.createConstructionSite(position.x, position.y + 1)){
        //             console.log("Creating Link Above");
        //         }else if(Game.spawns[spawnName].room.createConstructionSite(position.x - 1, position.y)){
        //             console.log("Creating Link Left");
        //         }else if(Game.spawns[spawnName].room.createConstructionSite(position.x + 1, position.y)){
        //             console.log("Creating Link Right");
        //         }
        // }
    }
}

module.exports = buildStructures;