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
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
                git branch: 'main', credentialsId: "${env.GITHUB_CREDENTIALS_ID}", url: 'https://github.com/sreep1207/app.git'
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
            }
          }
        }
        stage('Update Deployment File') {
            steps {
                script {
                    sh 'git config user.email "sridhar.innoraft@gmail.com"'
                    sh 'git config user.name "sree1207"'
                    sh 'git remote -v' // Check remote configuration
                    sh 'git status' // Check the current status
                    sh 'git stash || true'
                    sh 'git pull https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main'
                    sh 'ls -al /workspace' // Check contents of workspace
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
