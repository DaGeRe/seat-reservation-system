mvn clean install -U -DskipTests -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository
mvn clean package -DskipTests -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository
mvn dependency:go-offline -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository

mvn clean install -U -DskipTests
mvn clean package -DskipTests
mvn dependency:go-offline

mvn dependency:tree # fehler im pom finden