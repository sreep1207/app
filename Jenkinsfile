pipeline {
 agent  {
        docker {
            image 'sree1207/docker:latest' // Your Docker-enabled image
            args '--user privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                sh 'echo passed'
                // Uncomment the following line if you need to checkout from git
                //git branch: 'main', url: 'https://github.com/sreep1207/app.git', credentialsId: 'git'
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
        GIT_REPO_NAME = "app"
        GIT_USER_NAME = "sreep1207"
      }
      steps {
        withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
             sh '''
                        echo "Current Directory:"
                        pwd
                        echo "Directory Contents:"
                        ls -la
                        echo "Git Directory Check:"
                        ls -la .git
                        echo "Git Version"
                        git --version
                        echo "Configuring Git..."
                        git config user.email "sridhar.innoraft@gmail.com"
                        git config user.name "sreep1207"
                        # Ensure we are on the correct branch
                        git fetch origin
                        git checkout main || git checkout -b main
                        BUILD_NUMBER=${BUILD_NUMBER}
                        # Ensure the file exists before trying to update it
                        if [ -f app-manifests/deployment.yaml ]; then
                            sed -i "s/latest/${BUILD_NUMBER}/g" app-manifests/deployment.yaml
                            git add app-manifests/deployment.yaml
                            git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                            git push origin main 
                        else
                            echo "Deployment file not found."
                            exit 1
                        fi
                    '''
        }
      }
    }
  }
}

