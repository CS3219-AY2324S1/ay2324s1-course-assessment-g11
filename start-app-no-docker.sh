#!/bin/sh

prepend() {
    while IFS= read -r line;
        do echo "$1$line"; 
    done
}

(yarnpkg install --frozen-lockfile && yarnpkg prisma generate && \
    trap 'kill 0' INT TERM; \
    (yarnpkg workspace frontend dev:local | prepend "frontend: ") & \
    (yarnpkg workspace user-service dev:local | prepend "user-service: ") & \
    (yarnpkg workspace admin-service dev:local | prepend "admin-service: ") & \
    (yarnpkg workspace question-service dev:local | prepend "question-service: ") & \
    wait)
