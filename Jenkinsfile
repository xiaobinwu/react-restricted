pipeline {
    agent any

    tools {
        maven 'Maven'
    }

    options {
       buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage ('Initialize') {
            steps {
                sh '''
                    export PATH=$PATH:/usr/local/node/bin
                    echo "PATH = ${PATH}"
                    echo "M2_HOME = ${M2_HOME}"
                '''
            }
        }

        stage ('Build') {
            steps {
                sh '''
                    export PATH=$PATH:/usr/local/node/bin
                    cnpm install
                '''
            }
        }
    }
}
