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
    args:
    - "--dockerfile=/workspace/Dockerfile"
    - "--context=/workspace"
    - "--destination=sree1207/myapp15:${env.IMAGE_TAG}"
    - "--verbosity=debug"
    - "--docker-config=/kaniko/.docker/"
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
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-pwd'
        GIT_REPO_URL = 'https://github.com/sreep1207/app.git'
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()  // Clean workspace before starting
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: "${GITHUB_CREDENTIALS_ID}", url: "${GIT_REPO_URL}"
            }
        }

        stage('Verify Checkout') {
            steps {
                sh 'ls -l /home/jenkins/agent/workspace/app'
            }
        }

        stage('Build and Push Docker Image with Kaniko') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                        /kaniko/executor --dockerfile=/workspace/Dockerfile --context=/workspace --destination=sree1207/myapp15:${IMAGE_TAG} --verbosity=debug --docker-config=/kaniko/.docker/ || true
                        """
                    }
                }
            }
        }

        stage('Update Deployment File and Push Changes') {
            steps {
                container('kaniko') {
                    script {
                        try {
                            // Git configuration for committing
                            sh 'git config user.email "sridhar.innoraft@gmail.com"'
                            sh 'git config user.name "sree1207"'

                            // Pull latest changes and stash any local changes
                            sh """
                            git stash || true
                            git pull https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git main
                            """

                            // Update deployment.yaml file with the new image tag
                            def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                            sh "sed -i 's|image:sree1207/myapp15:.*|image: sree1207/myapp15:${IMAGE_TAG}|g' app-manifests/deployment.yaml"

                            // Commit the updated file and push changes to the Git repo
                            sh """
                            git add app-manifests/deployment.yaml
                            git commit -m "Update deployment image to version ${IMAGE_TAG} with commit ID ${commitId}"
                            git push https://${GITHUB_CREDENTIALS_ID}@github.com/sreep1207/app.git HEAD:main
                            """
                        } catch (e) {
                            echo "Error during update: ${e}"
                            error("Failed due to error: ${e}")
                        }
                    }
                }
            }
        }
    }
}
