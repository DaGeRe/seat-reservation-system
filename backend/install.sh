mvn clean install -U -DskipTests -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository
mvn clean package -DskipTests -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository
mvn dependency:go-offline -Dmaven.repo.local=/home/r/DeskSharingTool_Dev/backend/.m2/repository
mvn dependency:tree # fehler im pom finden