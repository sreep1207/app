pipeline {
agent {
    kubernetes {
      yamlFile 'kaniko-builder.yaml'
    }
  }
    environment {
        APP_NAME = "app"
        DOCKER_USER = "sree1207"
        DOCKER_PASS = credentials('dockerhub-pwd')
        IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
        IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        GITHUB_CREDENTIALS_ID = 'github'
        JENKINS_URL = 'http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@10.100.23.220:8080/'
    }

    stages {
        stage('Test Jenkins Connection') {
            steps {
                script {
                    // Test the connection to the Jenkins server
                    echo "Testing connection to Jenkins at ${JENKINS_URL}..."
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${JENKINS_URL}", returnStdout: true).trim()
                    if (response == '200') {
                        echo "Connection to Jenkins is successful!"
                    } else {
                        error "Failed to connect to Jenkins, HTTP response code: ${response}"
                    }
                }
            }
        }

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
                    sh 'ls -la "${WORKSPACE}"' // Verify if files are present
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                container(name: 'kaniko') {
                     sh '''
                          echo "Current Directory: `pwd`"
                          echo "Image Name: ${IMAGE_NAME}"
                          echo "Image Tag: ${IMAGE_TAG}"
                          echo "Starting Kaniko build..."
                        /kaniko/executor --dockerfile=$(pwd)/Dockerfile --context=$(pwd) --destination=sree1207/myapp15:${IMAGE_TAG}
                    '''
        
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
                    sh "sed -i 's|image: ${IMAGE_NAME}:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|g' app-manifests/deployment.yaml"

                    // Commit and push the changes
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${IMAGE_TAG}"
                    git push https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                    """
                }
            }
        }
    }
}
