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
        COMMIT_ID = sh(script: 'git rev-parse HEAD', returnStdout: true).trim() // Get the commit ID
        DOCKER_IMAGE = "sree1207/my-app15:${COMMIT_ID}"
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
          script {
            // Add the directory to safe directories
            sh 'git config --global --add safe.directory /var/lib/jenkins/workspace/Drupal'
        }
        withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
        sh '''
        # Navigate to the repository directory
        cd /var/lib/jenkins/workspace/Drupal

        echo "Adding Jenkins workspace to safe directories..."
        #git config --global --add safe.directory /var/lib/jenkins/workspace/Drupal

        echo "Configuring Git..."
        git config user.email 'sridhar.innoraft@gmail.com'
        git config user.name 'sreep1207'

         # Check for local changes
         if ! git diff-index --quiet HEAD --; then
             echo "Local changes detected. Stashing..."
             git stash  # UPDATED: Stash any local changes to avoid merge conflicts
         fi


       # Use HTTPS with the GitHub token for authentication
        echo "Fetching the latest changes from origin..."
        git fetch https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git || exit 1

        # Ensure we are on the correct branch
        git checkout main || git checkout -b main

        # Pull the latest changes from the remote branch to avoid conflicts
        git pull https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git main || exit 1

         echo "Before updating:"
        cat app-manifests/deployment.yaml
        # Get the latest commit ID
        COMMIT_ID=$(git rev-parse HEAD)
                   
        # Update only the image version in the deployment.yaml file
        #BUILD_NUMBER=${BUILD_NUMBER}
         # Update the deployment.yaml file with the new build number
         sed -i 's|image: sree1207/my-app15:[^ ]*|image: sree1207/my-app15:'"${COMMIT_ID}"'|g' app-manifests/deployment.yaml

        echo "Deployment file updated."
        echo "After updating:"
        cat app-manifests/deployment.yaml
                            
        # Commit and push changes
        git add app-manifests/deployment.yaml
        git commit -m "Update deployment image to version ${COMMIT_ID}"
        git push https://$GITHUB_TOKEN@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git HEAD:main
        '''
        }
      }
    }
  }
}

