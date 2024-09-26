pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent' // Label for Kaniko agent
            defaultContainer 'kaniko'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:latest
      command:
        - cat
      tty: true
      volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
  volumes:
    - name: kaniko-secret
      secret:
        secretName: docker-hub-secret
        items:
          - key: .dockerconfigjson
            path: config.json
"""
        }
    }
    
    environment {
        GIT_REPO_NAME = "app"
        GIT_USER_NAME = "sreep1207"
        GITHUB_TOKEN = credentials('github') // Using Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the SCM repository
                git url: "https://github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git", branch: 'main', credentialsId: 'github'
            }
        }
         stage('Verify Context Directory') {
            steps {
                script {
                    // Check the contents of the workspace directory
                    echo "Listing contents of the workspace directory:"
                    sh 'ls -la /var/jenkins_home/workspace/app' // Adjust this path if necessary
                }
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Set the safe directory for git
                    sh 'git config --global --add safe.directory /var/jenkins_home/workspace/app'

                    // Get the commit ID
                    def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    def dockerImage = "sree1207/my-app15:${commitId}"

                    // Use Kaniko to build and push the Docker image
                    sh """
                    /kaniko/executor \\
                      --context=dir:/var/jenkins_home/workspace/app  \\
                      --dockerfile Dockerfile \\
                      --destination ${dockerImage} \\
                      --cleanup \\
                      --verbosity debug
                    """
                }
            }
        }

        stage('Update Deployment File') {
            steps {
                script {
                    // Add the directory to safe directories
                    sh 'git config --global --add safe.directory /var/jenkins_home/workspace/app'

                    // Navigate to the repository directory
                    sh 'cd /var/jenkins_home/workspace/app'

                    echo "Configuring Git..."
                    sh """
                    git config user.email 'sridhar.innoraft@gmail.com'
                    git config user.name '${GIT_USER_NAME}'

                    # Check for local changes
                    if ! git diff-index --quiet HEAD --; then
                        echo "Local changes detected. Stashing..."
                        git stash  # Stash any local changes to avoid merge conflicts
                    fi

                    # Pull the latest changes from the remote branch to avoid conflicts
                    echo "Fetching the latest changes from origin..."
                    git pull https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git main || exit 1

                    echo "Before updating:"
                    cat app-manifests/deployment.yaml

                    # Get the latest commit ID
                    def COMMIT_ID = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()

                    # Update the deployment.yaml file with the new commit ID
                    sed -i 's|image: sree1207/my-app15:[^ ]*|image: sree1207/my-app15:'"${COMMIT_ID}"'|g' app-manifests/deployment.yaml

                    echo "Deployment file updated."
                    echo "After updating:"
                    cat app-manifests/deployment.yaml

                    # Commit and push changes
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${COMMIT_ID}"
                    git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git HEAD:main
                    """
                }
            }
        }
    }
}

