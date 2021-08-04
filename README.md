# FX Job


## Overview

Sample Job application for IBM Cloud Code Engine.

This application itself would retrieve current FX information, and store it into IBM Cloudant.


## How to setup

0. (If you want to use your own container image,) Build and Push your image into container registry like hub.docker.io. In this tutorial, I would use my own one(dotnsf/cejob).

  - You would need `docker` CLI to build you own image.

1. Create IBM Cloud account

  - Create IBM Cloud account, if you don't have one

    - https://cloud.ibm.com/register

2. Install / Setup ibmcloud CLI

  - Install ibmcloud CLI and CodeEngine CLI plugin into your PC
  
    - https://cloud.ibm.com/docs/codeengine?topic=codeengine-install-cli

3. Login to IBM Cloud with your ibmcloud CLI

  - `$ ibmcloud login`

4. Create and Select your CodeEngine project(`my-proj`)

  - Create : `$ ibmcloud ce project create --name my-proj`

  - Select : `$ ibmcloud ce project select --name my-proj`

  - Other commands:

    - List : `$ ibmcloud ce project list`

    - Show detail : `$ ibmcloud ce project get --name my-proj`

    - Delete : `$ ibmcloud ce project delete --name my-proj`

5. Create your job(`my-job`) in your selected project with image(dotnsf/cejob) and min-scale=1 settings

  - Create : `$ ibmcloud ce job create --name my-job --image dotnsf/fxjob --min-scale=1`

  - Other commands:

    - Show detail : `$ ibmcloud ce job get --name my-job`

    - Delete : `$ ibmcloud ce job delete --name my-job`

6. Subscribe cron-like ping(`my-sub`) with your application(`my-job`) in your application, which would run every 5 min.

  - Create : `$ ibmcloud ce sub ping create --name my-sub --destination my-job --destination-type job --schedule "*/5 * * * *"`

  - Other commands:

    - Update(every 2H) : `$ ibmcloud ce sub ping update --name my-sub --schedule "0 */2 * * *"`

    - Show detail : `$ ibmcloud ce sub ping get --name my-sub`

    - Delete : `$ ibmcloud ce sub ping delete --name my-sub`


## Reference

https://prstaging--knative-v1.netlify.app/v0.5-docs/eventing/samples/cronjob-source/

https://github.com/IBM/CodeEngine/tree/main/job

https://cloud.ibm.com/docs/codeengine?topic=codeengine-job-deploy

https://cloud.ibm.com/docs/codeengine?topic=codeengine-subscribe-ping-tutorial


## Licensing

This code is licensed under MIT.


## Copyright

2021  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
