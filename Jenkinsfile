pipeline {
  agent {
    kubernetes {
      yamlFile 'kaniko-builder.yaml'
    }
  }

  environment {
    APP_NAME = "my-app15"
    RELEASE = "1.0.0"
    DOCKER_USER = "sree1207"
    DOCKER_PASS = 'Aeg$12345'
    IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
    JENKINS_URL = 'http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@10.100.23.22:8080/'
  }

  stages {
    stage("Cleanup Workspace") {
      steps {
        cleanWs()
      }
    }

    stage("Checkout from SCM") {
      steps {
        git branch: 'main', credentialsId: 'github', url: 'https://github.com/sreep1207/app.git'
      }
    }

    stage('Get Git Commit ID') {
      steps {
        script {
          GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.IMAGE_TAG = "${RELEASE}-${GIT_COMMIT}"
        }
      }
    }

    stage('Build & Push with Kaniko') {
      steps {
        container(name: 'kaniko', shell: '/busybox/sh') {
          sh '''

            /kaniko/executor --dockerfile=/var/jenkins_home/workspace/app/Dockerfile --context=/var/jenkins_home/workspace/app --destination=${IMAGE_NAME}:${IMAGE_TAG}
          '''
        }
      }
    }

    // New stage to check the status of the Kaniko pod
    stage('Check Kaniko Pod Status') {
      steps {
        script {
          echo 'Building Docker Image with Kaniko'
          // Ensure the Kaniko pod has completed before moving to the next step
          timeout(time: 10, unit: 'MINUTES') {
            waitUntil {
              script {
                // Check the status of the Kaniko pod
                def podStatus = sh(script: "kubectl get pods -l name=kaniko -o jsonpath='{.items[0].status.phase}'", returnStdout: true).trim()
                return podStatus == "Succeeded" || podStatus == "Running"
              }
            }
          }
        }
      }
    }
  }
}
