pipeline {

  agent {
    kubernetes {
      yamlFile 'kaniko-builder.yaml'
    }
  }

  environment {
        APP_NAME = "myapp16"
        RELEASE = "1.0.0"
        DOCKER_USER = "sree1207"
        DOCKER_PASS = 'Aeg$12345'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
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
          sh '''#!/busybox/sh

            /kaniko/executor --dockerfile=/var/jenkins_home/workspace/app/Dockerfile --context=/var/jenkins_home/workspace/app --destination=${IMAGE_NAME}:${IMAGE_TAG}
          '''
        }
      }
    }
  }
}
