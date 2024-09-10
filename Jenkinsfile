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
                        echo "Adding Jenkins workspace to safe directories..."
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal && git config --global user.email 'sridhar.innoraft@gmail.com'"
                        echo "Git Version"
                        git --version
                        echo "Checking Git remote..."
                        git remote -v
                        echo "Switching to SSH if necessary..."
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal &&  git remote set-url origin git@github.com:sreep1207/app.git || exit 1"
                        echo "Configuring Git..."
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal &&  git config user.email 'sridhar.innoraft@gmail.com'"
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal && git config user.name 'sreep1207'"
                        # Ensure we are on the correct branch
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal &&  git fetch origin"
                        su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal && git checkout main || git checkout -b main"
                        BUILD_NUMBER=${BUILD_NUMBER}
                        # Ensure the file exists before trying to update it
                        if [ -f app-manifests/deployment.yaml ]; then
                            su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal && sed -i "s/latest/${BUILD_NUMBER}/g" app-manifests/deployment.yaml"
                            su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal &&  git add app-manifests/deployment.yaml"
                            su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal &&  git commit -m 'Update deployment image to version ${BUILD_NUMBER}'"
                            su - jenkins -c "cd /var/lib/jenkins/workspace/Drupal && git push origin main || exit 1"
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

