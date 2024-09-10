pipeline {
 agent  {
        docker {
            image 'sree1207/docker:latest' // Your Docker-enabled image
            args '--user root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                sh 'echo passed'
                // Uncomment the following line if you need to checkout from git
                //git branch: 'main', url: 'https://github.com/sreep1207/app.git'
            }
        }
        
     stage('Build and Push Docker Image') {
      environment {
        DOCKER_IMAGE = "sree1207/my-app15:${BUILD_NUMBER}"
        // DOCKERFILE_LOCATION = "Dockerfile"
        REGISTRY_CREDENTIALS = credentials('dockerhub-pwd')
      }
      steps {
        script {
            sh 'docker build -t ${DOCKER_IMAGE} .'
            def dockerImage = docker.image("${DOCKER_IMAGE}")
            docker.withRegistry('https://index.docker.io/v1/', "dockerhub-pwd") {
                dockerImage.push()
            }
        }
      }
    }
  
    stage('Update Deployment File') {
      environment {
        GIT_REPO_NAME = "sreep1207/app"
        GIT_USER_NAME = "sreep1207"
      }
      steps {
        withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
          sh '''
            git config user.email "sridhar.innoraft@gmail.com"
            git config user.name "sreep1207"
            BUILD_NUMBER=${BUILD_NUMBER}
            sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" app-manifests/deployment.yaml
            git add app-manifests/deployment.yml
            git commit -m "Update deployment image to version ${BUILD_NUMBER}"
            git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
          '''
        }
      }
    }
  }
}

