pipeline {
  agent 
  
  stages {
    stage('Checkout') {
      steps {
        sh 'echo passed'
        //git branch: 'main', url: 'https://github.com/sreep1207/app.git'
      }
    }
  }
    stage('Build and Push Docker Image') {
      environment {
        DOCKER_IMAGE = "sreep1207/my-app15:${BUILD_NUMBER}"
        // DOCKERFILE_LOCATION = "app/Dockerfile"
        REGISTRY_CREDENTIALS = credentials('dockerhub-pwd')
      }
      steps {
        script {
            sh 'cd /app && docker build -t ${DOCKER_IMAGE} .'
            def dockerImage = docker.image("${DOCKER_IMAGE}")
            docker.withRegistry('https://index.docker.io/v1/', "dockerhub-pwd") {
                dockerImage.push()
            }
        }
      }
    }
     stage('Run Composer, Drush, and Gulp') {
      steps {
        script {
          // Run Composer install
          sh 'composer install'
          
          // Run Drush CIM with automatic confirmation
          dir('vendor/drush/drush'){
          sh 'yes | drush cim'
          // Run Drush CIM with automatic confirmation
          sh 'drsh cr'
          }
          // Navigate to the specific path and run Gulp
          dir('web/themes/custom/innoraft') {
          sh 'gulp'
          }
        }
      }
    }
    stage('Update Deployment File') {
        environment {
            GIT_REPO_NAME = "app"
            GIT_USER_NAME = "sreep1207"
        }
        steps {
            withCredentials([string(credentialsId: 'git', variable: 'GITHUB_TOKEN')]) {
                sh '''
                    git config user.email "sridhar.innoraft@gmail.com"
                    git config user.name "sreep1207"
                    BUILD_NUMBER=${BUILD_NUMBER}
                    sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" app-manifests/deployment.yml
                    git add app-manifests/deployment.yml
                    git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                    git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                '''
            }
        }
    }
  }
}
