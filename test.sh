#!/bin/sh
curl -X POST \
  -H "X-LC-Id: MAt7GaT4VjeOXrHC4NSBuGYP-gzGzoHsz" \
  -H "X-LC-Key: xXYEOSNDFSCARaVrL7xILeAI,master" \
  -H "Content-Type: application/json" \
  -d '{"from_client": "614455", "message": {"_lctype": -1, "_lctext": "Hello world"}}' \
  https://mat7gat4.api.lncld.net/1.2/rtm/conversations/5a3d03085b90c830ff7b5c1d/messages
