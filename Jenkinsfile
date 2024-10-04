pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              activeDeadlineSeconds: 1800
              containers:
                - name: kaniko
                  image: gcr.io/kaniko-project/executor:debug
                  imagePullPolicy: Always
                  command:
                    - sleep
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
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

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
                    sh '''
                    /kaniko/executor --dockerfile=/var/jenkins_home/workspace/app/Dockerfile --context=/var/jenkins_home/workspace/app --destination=${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }
}
