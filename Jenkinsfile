pipeline {
    agent {
        kubernetes {
            label 'kaniko'
            defaultContainer 'kaniko'
            containerTemplate(name: 'kaniko', image: 'gcr.io/kaniko-project/executor:debug', command: '/kaniko/executor') {
                args '--dockerfile=/workspace/Dockerfile --context=/workspace'
            }
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    def dockerImage = "sree1207/my-app15:${commitId}"
                    
                    sh "/kaniko/executor --dockerfile=/workspace/Dockerfile --context=/workspace --destination=${dockerImage}"
                }
            }
        }

        stage('Update Deployment File') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
                        sh '''
                        cd /workspace/app
                        git config user.email 'sridhar.innoraft@gmail.com'
                        git config user.name 'sreep1207'
                        
                        git fetch https://${GITHUB_TOKEN}@github.com/sreep1207/app.git
                        git checkout main
                        git pull https://${GITHUB_TOKEN}@github.com/sreep1207/app.git main

                        COMMIT_ID=$(git rev-parse HEAD)
                        sed -i 's|image: sree1207/my-app15:[^ ]*|image: sree1207/my-app15:'"${COMMIT_ID}"'|g' app-manifests/deployment.yaml
                        git add app-manifests/deployment.yaml
                        git commit -m "Update deployment image to version ${COMMIT_ID}"
                        git push https://$GITHUB_TOKEN@github.com/sreep1207/app.git HEAD:main
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up after build...'
        }
    }
}
