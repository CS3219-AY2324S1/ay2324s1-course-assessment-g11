# Build root docker image
docker build -t peerprep-base -f ../Dockerfile .

# Create array of services
service_array=("admin-service" "collaboration-service" "gateway" "matching-service" "question-service" "user-service" "frontend")

# Build and publish prod images
for s in ${service_array[@]}; do
  docker build \
    --tag asia-southeast1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[s]}:latest \
    --file prod-dockerfiles/Dockerfile.${service_array[s]}-prod .
  docker push asia-southeast1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[s]}:latest
done


