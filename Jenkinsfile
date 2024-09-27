pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent' // Label for Kaniko agent
            defaultContainer 'kaniko'
            yaml """
apiVersion: v1
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
  restartPolicy: Never
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
        GITHUB_CREDENTIALS_ID = 'github' // Using Jenkins credentials
        DOCKER_IMAGE_NAME = "sree1207/my-app15"
    }
    
    stages {
        stage('Cleanup') {
            steps {
                cleanWs()
            }
        }
        
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub using the specified credentials
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Specify the branch
                    userRemoteConfigs: [[
                        url: 'https://github.com/sreep1207/app.git',
                        credentialsId: "${GITHUB_CREDENTIALS_ID}" // Use the defined credentials
                    ]]
                ])
            }
        }
        
        stage('Verify Context Directory') {
            steps {
                script {
                    // Check the contents of the workspace directory
                    echo "Listing contents of the workspace directory:"
                    sh 'ls -la ${WORKSPACE}' // Verify if files are present
                }
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Get the commit ID for tagging the Docker image
                    def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    def dockerImage = "${DOCKER_IMAGE_NAME}:${commitId}"
                    
                    // Use Kaniko to build and push the Docker image
                    sh """
                    /kaniko/executor \\
                      --context=${WORKSPACE} \\
                      --dockerfile=${WORKSPACE}/Dockerfile \\
                      --destination=${dockerImage} \\
                      --verbosity debug
                    """
                }
            }
        }

        stage('Update Deployment File') {
            steps {
                script {
                    // Set Git config
                    sh 'git config user.email "sridhar.innoraft@gmail.com"'
                    sh 'git config user.name "sree1207"'

                    // Fetch the latest changes
                    sh """
                    git stash || true
                    git pull https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main
                    """

                    // Update the deployment.yaml with the new image tag
                    def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    sh "sed -i 's|image: ${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_IMAGE_NAME}:${commitId}|g' app-manifests/deployment.yaml"

                    // Commit and push the changes
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${commitId}"
                    git push https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                    """
                }
            }
        }
    }
}
