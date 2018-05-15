const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {

    console.log(`Started on event ${brigadeEvent} with ${project}`)

})

