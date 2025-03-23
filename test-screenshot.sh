#!/bin/bash

set -o allexport
source test-screenshot.env
set +o allexport

rm screenshots/* || true

npm install
npx tsx screenshot/app.ts

