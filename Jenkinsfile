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
                    echo 'Checking out the repository...'
                    git branch: 'main', credentialsId: "${env.GITHUB_CREDENTIALS_ID}", url: 'https://github.com/sreep1207/app.git'
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    echo "Checked out commit: ${env.GIT_COMMIT}"
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
    command: ["sh", "-c", "/kaniko/executor --dockerfile=/workspace/Dockerfile --context=/workspace --destination=sree1207/my-app15:${RELEASE}-${env.GIT_COMMIT}"]
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
                    sh 'ls -al /workspace'  // Verify files are present
                }
            }
        }
        stage('Update Deployment File') {
            steps {
                script {
                    echo 'Updating Deployment File...'
                    sh 'git config user.email "sridhar.innoraft@gmail.com"'
                    sh 'git config user.name "sree1207"'
                    sh 'git remote -v'
                    sh 'git status'
                    sh 'git stash || true'
                    sh "git pull https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main || exit 1"
                    sh "sed -i 's|image: sree1207/my-app15:.*|image: sree1207/my-app15:${RELEASE}-${env.GIT_COMMIT}|g' app-manifests/deployment.yaml"
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${RELEASE}-${env.GIT_COMMIT}"
                    git push https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main || exit 1
                    """
                }
            }
        }
    }
}
