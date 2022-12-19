#!/usr/bin/env bash
chmod +x ./cleanup.sh

find . \( -type d -name node_modules -o -type d -name .next -o -type f -name '*config*' \) -prune -o -name '*.js' -exec rm {} +