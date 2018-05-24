const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {

    // The boring stuff
    const acrServer = project.secrets.acrServer
    const acrName = project.secrets.acrName
    const azServicePrincipal = project.secrets.azServicePrincipal
    const azClientSecret = project.secrets.azClientSecret
    const azTenant = project.secrets.azTenant
    const database = project.secrets.database
    const gitPayload = JSON.parse(brigadeEvent.payload)
    const today = new Date()

    const gitSHA = brigadeEvent.revision.commit.substr(0, 7)
    const imageTag = String(gitSHA)

    // The good stuff
    const frontend = new Job("job-runner-frontend")
    frontend.storage.enabled = false
    frontend.image = "microsoft/azure-cli"
    frontend.tasks = [
        `cd /src/frontend`,
        `az login --service-principal -u ${azServicePrincipal} -p ${azClientSecret} --tenant ${azTenant}`,
        `az acr build -t frontend:${imageTag} --build-arg REACT_APP_SHA=${gitSHA} -f ./Dockerfile . -r ${acrName}`
    ]

    const frontend_helm = new Job("job-runner-frontend-helm")
    frontend_helm.storage.enabled = false
    frontend_helm.image = "lachlanevenson/k8s-helm:v2.8.2"
    frontend_helm.tasks = [
        `helm upgrade --install --reuse-values frontend ./src/Charts/frontend --set image=${acrServer}/frontend --set imageTag=${imageTag}`
    ]



    // The good stuff
    const api = new Job("job-runner-api")
    api.storage.enabled = false
    api.image = "microsoft/azure-cli"
    api.tasks = [
        `cd /src/api`,
        `az login --service-principal -u ${azServicePrincipal} -p ${azClientSecret} --tenant ${azTenant}`,
        `az acr build -t api:${imageTag}  -f ./Dockerfile . -r ${acrName}`
    ]   

    const api_helm = new Job("job-runner-api-helm")
    api_helm.storage.enabled = false
    api_helm.image = "lachlanevenson/k8s-helm:v2.8.2"
    api_helm.tasks = [
        `echo helm upgrade --install --reuse-values api ./src/Charts/api --set database=${database} image=${acrServer}/api --set imageTag=${imageTag}`,
        `helm upgrade --install --reuse-values api ./src/Charts/api --set database=${database} image=${acrServer}/api --set imageTag=${imageTag}`
    ]
    Group.runEach([frontend, frontend_helm])
    Group.runEach([api, api_helm])



})

