# Projects Service - Migration Note

## Current Status
The projects-service controllers need to be updated from MongoDB to Firestore.

## Files Needing Update:
- `src/controllers/project.controller.ts` - Replace MongoDB queries with Firestore
- `src/controllers/publish.controller.ts` - Replace MongoDB queries with Firestore

## Temporary Solution
For deployment, create stub implementations that return empty responses.
This allows the service to deploy and be updated later with full Firestore implementation.

## Next Steps
1. Deploy with stub implementations
2. Implement proper Firestore queries for CRUD operations
3. Test all endpoints

Delete this file once migration is complete.
