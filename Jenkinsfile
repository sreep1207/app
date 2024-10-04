pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              activeDeadlineSeconds: 3400
              terminationGracePeriodSeconds: 1200
              containers:
                - name: jenkins-agent
                  image: jenkins/inbound-agent
                  args:
                    - "-url"
                    - "http://admin:11fbc521a3d5f40fe5c7c05a04032677a3@10.100.23.220:8080/"
                    - "6c415231f727ece9a9fab366895706e25948fccdaf81d31c669524e74d177e4a"
                    - "kanikoagent"
                - name: kaniko
                  image: gcr.io/kaniko-project/executor:debug
                  imagePullPolicy: Always
                  command:
                    - sleep
                  args:
                    - "9999999"
                  volumeMounts:
                    - name: jenkins-docker-cfg
                      mountPath: /kaniko/.docker
                    - name: efs-jenkins-pv
                      mountPath: /var/jenkins_home
                  resources:
                    limits:
                      memory: "2Gi"  
                      cpu: "1"        
                    requests:
                      memory: "1Gi"   
                      cpu: "0.5"      
              volumes:
                - name: jenkins-docker-cfg
                  projected:
                    sources:
                      - secret:
                          name: docker-hub-secret
                          items:
                            - key: .dockerconfigjson
                              path: config.json
                - name: efs-jenkins-pv
                  persistentVolumeClaim:
                    claimName: efs-jenkins-pvc
            '''
        }
    }

    environment {
        APP_NAME = "my-app15"
        RELEASE = "1.0.0"
        DOCKER_USER = "sree1207"
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        GIT_CREDENTIALS_ID = 'github'
    }

    stages {
        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: GIT_CREDENTIALS_ID, url: 'https://github.com/sreep1207/app.git'
            }
        }

        stage('Get Git Commit ID') {
            steps {
                script {
                    GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.IMAGE_TAG = "${RELEASE}-${GIT_COMMIT}"
                }
            }
        }

        stage('Build & Push with Kaniko') {
            steps {
                container(name: 'kaniko') {
                    script {
                        echo "Starting Kaniko build..."
                        // Check if the necessary files exist
                        sh 'ls -la /var/jenkins_home/workspace/app'
                        
                        // Run the Kaniko executor to build and push the image
                        sh '''
                        /kaniko/executor \
                          --dockerfile=/var/jenkins_home/workspace/app/Dockerfile \
                          --context=/var/jenkins_home/workspace/app \
                          --destination=${IMAGE_NAME}:${IMAGE_TAG} \
                          || { echo "Kaniko build failed"; exit 1; }
                        echo "Kaniko build completed successfully."
                        '''
                    }
                }
            }
        }
    stage('Update GitHub Repository') {
            steps {
                script{
                     sh '''
                    git config user.email 'sridhar.innoraft@gmail.com'
                    git config user.name 'sreep1207'
                    git config --global --add safe.directory /var/jenkins_home/workspace/app
                    # Set Git pull behavior to rebase
                    git config pull.rebase true
                    # Ensure we are on the correct branch
                    git fetch origin
                    git checkout main || git checkout -b main
                    # Pull the latest changes from the remote branch
                    git pull origin main
                    '''

                    // Get the current commit ID
                    COMMIT_ID = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()

                    // Ensure the deployment file exists before trying to update it
                    if (fileExists('app-manifests/deployment.yaml')) {
                        // Update the image tag in deployment.yaml
                        sh '''
                         sed -i 's|image: sree1207/my-app15:[^ ]*|image: sree1207/my-app15:${IMAGE_TAG}|g' app-manifests/deployment.yaml
                        git add app-manifests/deployment.yaml
                        git add app-manifests/deployment.yaml
                        git commit -m "Update deployment image to commit ${COMMIT_ID}"
                               '''
                         // Verify the changes
                        echo "After replacement, deployment.yaml contents:"
                        sh 'cat app-manifests/deployment.yaml'

                        // Push the changes back to GitHub
                        withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                            sh '''
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/sreep1207/app.git main
                            '''
                        }
                    } else {
                        echo "Deployment file not found."
                        error("Deployment file not found.")
             
            }
         }
     }
  }
}    
post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs above for more details."
        }
    }
}
