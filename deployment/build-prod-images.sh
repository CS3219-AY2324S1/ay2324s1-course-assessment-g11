# Build root docker image with context set to be parent directory
docker build -t peerprep-base -f ../Dockerfile ..

# Create array of services
declare -a service_array
service_array=("admin-service" "collaboration-service" "gateway" "matching-service" "question-service" "user-service" "frontend")

# Build and publish prod images with context set to be parent directory
for i in ${!service_array[@]}; do
#  docker build \
#    --tag $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[$s]}:latest \
#    --file prod-dockerfiles/Dockerfile.${service_array[$s]}-prod ..
  #docker push $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[$s]}:latest
    docker build \
      --tag ${service_array[$i]}:latest \
      --file prod-dockerfiles/Dockerfile.${service_array[$i]}-prod ..
done
