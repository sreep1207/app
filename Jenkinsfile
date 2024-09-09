pipeline {
 agent  {
        docker {
            image 'sreep1207/docker:latest' // Your Docker-enabled image
            //args '--privileged' // Mount Docker socket
        }
    }

    environment {
        DOCKER_HOST = 'tcp://localhost:2222'
        DOCKER_IMAGE = "sreep1207/my-app15:${BUILD_NUMBER}"
        REGISTRY_CREDENTIALS = credentials('dockerhub-pwd')
    }

    stages {
        stage('Checkout') {
            steps {
                sh 'echo passed'
                // Uncomment the following line if you need to checkout from git
                //git branch: 'main', url: 'https://github.com/sreep1207/app.git'
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Check the contents of the workspace for debugging
                    sh 'ls -la'
                    
                   try {
                        sh "docker -H tcp://localhost:2222 build -t ${DOCKER_IMAGE} ."
                        sh "echo ${DOCKER_HUB_PASSWORD} | docker -H tcp://localhost:2222 login -u ${DOCKER_HUB_USERNAME} --password-stdin"
                        sh "docker -H tcp://localhost:2222 push ${DOCKER_IMAGE}"
                    } catch (Exception e) {
                        error "Failed to build and push Docker image: ${e.getMessage()}"
                    }
                }
            }
        }
                    }
                }
            }
        }

  
    stage('Run Composer, Drush, and Gulp') {
      steps {
        script {
          // Run Composer install
          sh 'composer install'
          
          // Run Drush CIM with automatic confirmation
          dir('vendor/drush/drush') {
            sh 'yes | drush cim'
            sh 'drush cr'
          }

          // Navigate to the specific path and run Gulp
          dir('web/themes/custom/innoraft') {
            sh 'gulp'
          }
        }
      }
    }

    stage('Update Deployment File') {
      environment {
        GIT_REPO_NAME = "app"
        GIT_USER_NAME = "sreep1207"
      }
      steps {
        withCredentials([string(credentialsId: 'git', variable: 'GITHUB_TOKEN')]) {
          sh '''
            git config user.email "sridhar.innoraft@gmail.com"
            git config user.name "sreep1207"
            BUILD_NUMBER=${BUILD_NUMBER}
            sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" app-manifests/deployment.yml
            git add app-manifests/deployment.yml
            git commit -m "Update deployment image to version ${BUILD_NUMBER}"
            git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
          '''
        }
      }
    }
  }
}

