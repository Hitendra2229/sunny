#!/bin/bash

response_code=$(curl -s -o /dev/null -w "%{http_code}" guvi.in)

if [ "$response_code" -eq 200 ]; then
    echo "Success! The website guvi.in is accessible."
else
    echo "Failure! The website guvi.in returned an HTTP error code: $response_code"
fi

#Result------ $ bash task4.sh
#Failure! The website guvi.in returned an HTTP error code: 301

