#!/bin/sh

(yarn && yarn prisma generate && \
    trap 'kill 0' INT TERM; \
    yarn workspace frontend dev:local & \
    yarn workspace user-service dev:local & \
    yarn workspace admin-service dev:local & \
    yarn workspace collaboration-service dev & \
    yarn workspace matching-service dev & \
    yarn workspace question-service dev & \
    yarn workspace gateway dev:local & \
    wait)
