#!/bin/sh

prepend() {
    while IFS= read -r line;
        do echo "$1$line"; 
    done
}

(yarn && yarn prisma generate && \
    trap 'kill 0' INT TERM; \
    (yarn workspace frontend dev:local | prepend "frontend: ") & \
    (yarn workspace user-service dev:local | prepend "user-service: ") & \
    (yarn workspace admin-service dev:local | prepend "admin-service: ") & \
    (yarn workspace collaboration-service dev | prepend "collaboration-service: ") & \
    (yarn workspace matching-service dev | prepend "matching-service: ") & \
    (yarn workspace question-service dev | prepend "question-service: ") & \
    (yarn workspace gateway dev:local | prepend "gateway: ") & \
    wait)
