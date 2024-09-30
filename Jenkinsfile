pipeline {
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
    imagePullPolicy: Always
    command:
    - sleep
    args:
    - 9999999
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
    environment {
        APP_NAME = "app"
        RELEASE = "1.0.0"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        GITHUB_CREDENTIALS_ID = 'github'
        JENKINS_URL = 'http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@127.0.0.1:8080/'
    }
    stages {
        stage('Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/sreep1207/app.git'
            }
        }

        stage('Verify Git Checkout') {
            steps {
                sh 'ls -l /home/jenkins/agent/workspace/app'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                timeout(time: 10, unit: 'MINUTES')
                container(name: 'kaniko', shell: '/busybox/sh') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-pwd', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // List files in the workspace for debugging
                        sh 'ls -l /workspace'
                        sh 'df -h'

                        // Build and push the image
                        sh """
                        /kaniko/executor --dockerfile=\$(pwd)/Dockerfile --context=\$(pwd) --destination=sree1207/myapp15:${IMAGE_TAG} --verbosity=debug
                        """
                    }
                }
            }
        }

        stage('Update Deployment File') {
            steps {
                script {
                    try {
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
                        sh "sed -i 's|image:sree1207/myapp15 :.*|image: sree1207/myapp15:${IMAGE_TAG}|g' app-manifests/deployment.yaml"

                        // Commit and push the changes
                        sh """
                        git add app-manifests/deployment.yaml
                        git commit -m "Update deployment image to version ${IMAGE_TAG} with commit ID ${commitId}"
                        git push https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                        """
                    } catch (e) {
                        echo "Error occurred: ${e}"
                        error("Stage failed due to error: ${e}")
                    }
                }
            }
        }
    }
}
