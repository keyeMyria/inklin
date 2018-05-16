const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {

    var acrServer = project.secrets.acrServer
    var acrName = project.secrets.acrName
    var azServicePrincipal = project.secrets.azServicePrincipal
    var azClientSecret = project.secrets.azClientSecret
    var azTenant = project.secrets.azTenant
    var gitPayload = JSON.parse(brigadeEvent.payload)
    var today = new Date()

    var gitSHA = brigadeEvent.revision.commit.substr(0,7)
    var imageTag = "master-" + String(gitSHA)
    var acrImage = image + ":" + imageTag

    var frontend = new Job("job-runner-frontend")
    frontend.storage.enabled = false
    frontend.image = "azure-cli"
    frontend.tasks = [
        `cd /src/frontend`,
        `az login --service-principal -u ${azServicePrincipal} -p ${azClientSecret} --tenant ${azTenant}`,
        `az acr build -t frontend:${gitSHA} -f ./Dockerfile --context . -r ${acrName}`
    ]

    var api = new Job("job-runner-api")
    api.storage.enabled = false
    api.image = "alpine"
    api.tasks = [
        `cd /src/api`,
        `ls`
    ]

    var pipeline = new Group()
    pipeline.add(frontend)
    pipeline.add(api)
    pipeline.runAll()

})

