#!/usr/bin/bash
# Fetch and prepare fairshake's schema.js to play well with imports

echo "import coreapi from 'coreapi'"
echo "window.coreapi = coreapi"
curl "https://fairshake.cloud/coreapi/schema.js"
echo "module.exports = window.schema"
