#!/usr/bin/env bash

set -euo pipefail

echo "===> Formatting"

./tflocal.sh fmt -check -recursive

echo "===> Validating"

./tflocal.sh validate

echo "===> Planning"

./tflocal.sh plan \
    -refresh=false \
    -no-color \
    -input=false

echo "===> Done"
