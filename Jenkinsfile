pipeline {

  agent {
    kubernetes {
      yamlFile 'kaniko-builder.yaml'
    }
  }

  environment {
        APP_NAME = "complete-prodcution-e2e-pipeline"
        RELEASE = "1.0.0"
        DOCKER_USER = "sreep1207"
        DOCKER_PASS = 'Aeg\$12345'
        IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        JENKINS_URL = 'http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@10.100.23.220:8080/'

    }

  stages {

    stage("Cleanup Workspace") {
      steps {
        cleanWs()
      }
    }

    stage("Checkout from SCM"){
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/sreep1207/app.git'
            }

        }

    stage('Build & Push with Kaniko') {
      steps {
        container(name: 'kaniko', shell: '/busybox/sh') {
          sh '''

            /kaniko/executor --dockerfile `pwd`/Dockerfile --context `pwd` --destination=${IMAGE_NAME}:${IMAGE_TAG} --destination=${IMAGE_NAME}:latest
          '''
        }
      }
    }
  }
}
