pipeline {
 agent  {
        docker {
            image 'sreep1207/docker:latest' // Your Docker-enabled image
            args '--privileged' // Mount Docker socket
        }
    }

   environment {
        DOCKER_HOST = 'tcp://localhost:2375'
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Verify the Docker daemon can be reached via TCP
                    sh "docker -H tcp://localhost:2375 info"
                    
                    // Build the Docker image
                    sh "docker -H tcp://localhost:2375 build -t ${DOCKER_IMAGE} ."
                    
                    // Log in to Docker Hub and push the Docker image
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-pwd', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        sh "echo ${DOCKER_HUB_PASSWORD} | docker -H tcp://localhost:2375 login -u ${DOCKER_HUB_USERNAME} --password-stdin"
                    }

                    // Push the Docker image to Docker Hub
                    sh "docker -H tcp://localhost:2375 push ${DOCKER_IMAGE}"
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

