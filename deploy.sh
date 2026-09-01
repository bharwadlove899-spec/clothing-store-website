#!/bin/bash

# Cloud Run deployment configuration for high-traffic e-commerce
# - Limits max instances to prevent uncontrolled scaling and excessive Firestore reads
# - concurrency=80 is the default and optimal for Node.js
gcloud run deploy rayka-kapda-house \
  --source . \
  --max-instances 10 \
  --concurrency 80 \
  --allow-unauthenticated
