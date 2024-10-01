pipeline {
    agent any
    environment {
        APP_NAME = "app"
        RELEASE = "1.0.0"
        IMAGE_TAG = "${RELEASE}-${env.GIT_COMMIT}" // Use GIT_COMMIT for tagging
        DOCKER_CREDENTIALS_ID = 'dockerhub-pwd'
        GITHUB_CREDENTIALS_ID = 'github'
    }
    stages {
        stage('Checkout') {
            steps {
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
    image: sree1207/kaniko:latest
    command: ["sleep"]
    args: ["infinity"]
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
                    // Output the Docker config for debugging
                    sh '''
                     echo "Contents of /kaniko:"
                    ls -l /kaniko
                    echo 'Generated Docker Config:'
                    cat /kaniko/.docker/config.json
                    
                    
                    #Run the Kaniko executor to build and push the image
                    
                    /kaniko/executor --dockerfile=$(pwd)/Dockerfile --context=$(pwd) --destination=sree1207/myapp16:${IMAGE_TAG} --verbosity=debug
                    '''
                }
            }
        }
        stage('Update Deployment File') {
            steps {
                script {
                    // Configure Git user
                    sh 'git config user.email "sridhar.innoraft@gmail.com"'
                    sh 'git config user.name "sree1207"'

                    // Stash any local changes and pull the latest changes from Git
                    sh """
                    git stash || true
                    git pull https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main
                    """

                    // Update the deployment.yaml with the new image tag
                    sh "sed -i 's|image: sree1207/myapp16:.*|image: sree1207/myapp16:${IMAGE_TAG}|g' app-manifests/deployment.yaml"

                    // Commit and push the changes
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${IMAGE_TAG}"
                    git push https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                    """
                }
            }
        }
    }
}
