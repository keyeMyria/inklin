FROM microsoft/azure-functions-runtime:v2.0.0-beta1
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV REACT_APP_SHA=${REACT_APP_SHA}
COPY . /home/site/wwwroot
RUN cd /home/site/wwwroot/inklin; npm install
