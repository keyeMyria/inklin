const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {

    console.log(`Started on event ${brigadeEvent} with ${project}`)


    var frontend = new Job("job-runner-frontend")
    frontend.storage.enabled = false
    frontend.image = "azure-cli:0.0.5"
    frontend.tasks = [
        `cd /frontend`,
        `ls`
    ]

    var api = new Job("job-runner-api")
    api.storage.enabled = false
    api.image = "alpine"
    api.tasks = [
        `cd /api`,
        `ls`
    ]

    var pipeline = new Group()
    pipeline.add(frontend)
    pipeline.add(api)
    pipeline.runAll()

})

