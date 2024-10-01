pipeline {
    agent any
    environment {
        APP_NAME = "app"
        RELEASE = "1.0.0"
        DOCKER_CREDENTIALS_ID = 'dockerhub-pwd'
        GITHUB_CREDENTIALS_ID = 'github'
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                      git branch: 'main', credentialsId: "${env.GITHUB_CREDENTIALS_ID}", url: 'https://github.com/sreep1207/app.git'
                }
            }
        }
        stage('Build and Push Docker Image') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["sh", "-c", "/kaniko/executor --dockerfile=/workspace/Dockerfile --context=/workspace --destination=sree1207/my-app15:${RELEASE}-${env.GIT_COMMIT} && sleep infinity"]
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
      - name: efs-kaniko-pv
        mountPath: /workspace
    securityContext:
      runAsUser: 0
  volumes:
    - name: kaniko-secret
      secret:
        secretName: docker-hub-secret
        items:
          - key: .dockerconfigjson
            path: config.json
    - name: efs-kaniko-pv
      persistentVolumeClaim:
        claimName: efs-kaniko-pvc 
"""
                }
            }
            steps {
               script {
                    echo 'Building Docker Image with Kaniko'
                    // Ensure the Kaniko pod has completed before moving to the next step
                    timeout(time: 10, unit: 'MINUTES') {
                        waitUntil {
                            script {
                                // Check the status of the Kaniko pod
                                def podStatus = sh(script: "kubectl get pods -l name=kaniko -o jsonpath='{.items[0].status.phase}'", returnStdout: true).trim()
                                return podStatus == "Succeeded" || podStatus == "Running"
                            }
                        }
                    }
                }
            }
        }
        stage('Update Deployment File') {
            steps {
                script {
                    // Git configuration
                    sh 'git config user.email "sridhar.innoraft@gmail.com"'
                    sh 'git config user.name "sree1207"'
                    sh 'git remote -v'
                    sh 'git stash || true'
                    // Pull the latest code to ensure we have the latest deployment.yaml
                    sh 'git pull https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main'
                    // Update deployment.yaml with the new image tag
                    sh "sed -i 's|image: sree1207/my-app15:.*|image: sree1207/my-app15:${RELEASE}-${env.GIT_COMMIT}|g' app-manifests/deployment.yaml"
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${RELEASE}-${env.GIT_COMMIT}"
                    git push https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                    """
                }
            }
        }
    }
}
