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
                script {
                    // Make changes to the repo if necessary (e.g., updating a version file)
                    // For example, you could create or update a file with the new image tag
                    sh '''
                    git config --global user.email "sridhar.reddy@innoraft.com"
                    git config --global user.name "sreep1207"
                    git config --global --add safe.directory /var/jenkins_home/workspace/app
                    '''
                    sh '''
                    echo "IMAGE_TAG=${IMAGE_TAG}" > version.txt
                    git add version.txt
                    git commit -m "Update image tag to ${IMAGE_TAG}"
                    '''
                }
                // Push the changes back to the GitHub repository
                git credentialsId: GIT_CREDENTIALS_ID, url: 'https://github.com/sreep1207/app.git'
                sh 'git push origin main'
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
