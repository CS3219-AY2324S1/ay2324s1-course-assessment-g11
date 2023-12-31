#!/bin/bash

# Build root docker image with context set to be parent directory
docker build -t peerprep-base -f ../Dockerfile ..

# Create array of services
declare -a service_array
service_array=("admin-service" "collaboration-service" "gateway" "matching-service" "question-service" "user-service")

# Build and publish backend prod images with context set to be parent directory
for i in ${!service_array[@]}; do
  docker build \
    --tag $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[$i]}:latest \
    --file prod-dockerfiles/Dockerfile.${service_array[$i]} ..
  docker push $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/${service_array[$i]}:latest
done

# Build and publish frontend prod image
docker build \
  --build-arg="NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG_ARG=$NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG" \
  --build-arg="NEXT_PUBLIC_HTTP_PROXY_GATEWAY_ADDRESS_ARG=$NEXT_PUBLIC_HTTP_PROXY_GATEWAY_ADDRESS" \
  --build-arg="NEXT_PUBLIC_WS_MATCH_PROXY_GATEWAY_ADDRESS_ARG=$NEXT_PUBLIC_WS_MATCH_PROXY_GATEWAY_ADDRESS" \
  --build-arg="NEXT_PUBLIC_WS_COLLABORATION_PROXY_GATEWAY_ADDRESS_ARG=$NEXT_PUBLIC_WS_COLLABORATION_PROXY_GATEWAY_ADDRESS" \
  --tag $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/frontend:latest \
  --file prod-dockerfiles/Dockerfile.frontend ..
docker push $GKE_REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPOSITORY_NAME/frontend:latest
