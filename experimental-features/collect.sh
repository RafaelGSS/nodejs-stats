#!/bin/bash

# Script to find and print sections with "Stability: 1" in the nodejs/node/docs/api/*.md

echo "⚠️ Remember to use this command inside nodejs/node folder."

PRINT_SECTION=${PRINT_SECTION:-1}

awk -v print_section=$PRINT_SECTION '
/#/ {
    if (found) {
        print file_content
        found = 0
    }
    title = $0
    file_content = FILENAME ": " title "\n"
}
/Stability: 1/ {
    found = 1
}
found {
    if (print_section) {
        file_content = file_content $0 "\n"
    }
}
END {
    if (found) {
        print file_content
    }
}
' doc/api/**
