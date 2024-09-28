pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko' 
            defaultContainer 'jnlp'
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    kaniko: "true"
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/sh
    tty: true
    resources:
      limits:
        memory: "1Gi"
        cpu: "500m"
"""
        }
    }
    environment {
        APP_NAME = "app"
        DOCKER_USER = "sree1207"
        DOCKER_PASS = "Aeg\$12345"
        IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        GITHUB_CREDENTIALS_ID = 'github'
        JENKINS_URL = 'http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@10.100.23.220:8080/'
   }

        stage('Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                // Checkout the code from GitHub using the specified credentials
                 git branch: 'main', credentialsId: 'github', url: 'https://github.com/sreep1207/app.git'
            }
        }


        stage('Build and Push Docker Image') {
            steps {
                container(name: 'kaniko',shell: '/busybox/sh') {
                     sh '''#!/busybox/sh
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
