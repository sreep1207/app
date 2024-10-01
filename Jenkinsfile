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
    image: gcr.io/kaniko-project/executor:debug
    args: 
    - "--context=git@github.com:sreep1207/app.git" 
    - "--destination=sree1207/myapp16:${env.IMAGE_TAG}" 
    - "--verbosity=debug"
    - "--docker-config=/kaniko/.docker/config.json"
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
      - name: efs-kaniko-pv
        mountPath: /workspace
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
                    // Setup Docker credentials
                    withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                        mkdir -p /kaniko/.docker
                        echo '{"auths": {"https://index.docker.io/v1/": {"auth": "'\$(echo -n $DOCKER_USER:$DOCKER_PASS | base64)'"}}}' > /kaniko/.docker/config.json

                        // Run the Kaniko executor to build and push the image
                        // Output Docker config for debugging
                echo 'Generated Docker Config:'
                cat /kaniko/.docker/config.json
                        """
                    }
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
                    sh "sed -i 's|image: sree1207/myapp16:.*|image: sree1207/myapp16:${env.IMAGE_TAG}|g' app-manifests/deployment.yaml"

                    // Commit and push the changes
                    sh """
                    git add app-manifests/deployment.yaml
                    git commit -m "Update deployment image to version ${env.IMAGE_TAG}"
                    git push https://${env.GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                    """
                }
            }
        }
    }
}
