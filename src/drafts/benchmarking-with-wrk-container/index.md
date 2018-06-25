---
title: Benchmarking Akka HTTP with wrk containers
date: "2018-03-12T06:31:00.000+0900"
---

## Overview

1. wrk and Akka HTTP
2. Dockerize wrk, with formatting tweaks
3. Dockerize Akka HTTP 
4. Kubernetise wrk and akka http - next>? survey about local Kubernetes on Windows?



https://kubernetes.io/docs/getting-started-guides/minikube/

command prompt with admin right

eval $(minikube docker-env)
C:\WINDOWS\system32>minikube docker-env
SET DOCKER_TLS_VERIFY=1
SET DOCKER_HOST=tcp://192.168.11.11:2376
SET DOCKER_CERT_PATH=C:\Users\nishyu\.minikube\certs
SET DOCKER_API_VERSION=1.23
REM Run this command to configure your shell:
REM @FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i

docker images
C:\WINDOWS\system32>docker images
REPOSITORY                                    TAG                 IMAGE ID            CREATED             SIZE
hello-node                                    v1                  3f944e08fa68        6 days ago          655MB
alpine                                        3.4                 c7fc7faf8c28        2 months ago        4.82MB
k8s.gcr.io/kubernetes-dashboard-amd64         v1.8.1              e94d2f21bc0c        3 months ago        121MB
gcr.io/google-containers/kube-addon-manager   v6.5                d166ffa9201a        4 months ago        79.5MB
gcr.io/k8s-minikube/storage-provisioner       v1.8.1              4689081edb10        4 months ago        80.8MB
k8s.gcr.io/k8s-dns-sidecar-amd64              1.14.5              fed89e8b4248        6 months ago        41.8MB
k8s.gcr.io/k8s-dns-kube-dns-amd64             1.14.5              512cd7425a73        6 months ago        49.4MB
k8s.gcr.io/k8s-dns-dnsmasq-nanny-amd64        1.14.5              459944ce8cc4        6 months ago        41.4MB
node                                          6.9.2               faaadb4aaf9b        15 months ago       655MB
k8s.gcr.io/nginx-slim                         0.8                 18ea23a675da        21 months ago       110MB
gcr.io/google_containers/pause-amd64          3.0                 99e59f495ffa        23 months ago       747kB
nginx                                         1.7.9               84581e99d807        3 years ago         91.7MB


タグはlatest以外にする必要があることに注意。でないと、k8sはregistryからイメージをpullしてこようとしてしまいます。
(http://kubernetes.io/docs/getting-started-guides/minikube/#reusing-the-docker-daemon)




docker run myrepository:mytag
ENTRYPOINT: [command "entarg1" "entarg2"] # exec form
CMD       : whatever
RESULT    : command entarg1 entarg2 
#CMD will be ignored

docker run myrepository:mytag arg1 arg2
ENTRYPOINT: [command "entarg1" "entarg2"] # exec form
CMD       : whatever
RESULT    : command entarg1 entarg2 arg1 arg2
#arg1 arg2 will be apppeneded to ENTRYPOINT, and CMD will be overrided

docker run myrepository:mytag arg1 arg2
ENTRYPOINT: command entarg1 entarg2 # shell form
CMD       : whatever
RESULT    : command entarg1 entarg2 
#ETRYPOINT in shell form prevents any CMD or run arguments from being used



docker run myrepository:mytag cmd

docker run myrepository:mytag cmd arg1 arg2