# TODO: Firebase Realtime Database Integration

## Steps
- [x] 1. Analyze project architecture (backend FastAPI + SQLAlchemy, frontend React)
- [x] 2. Confirm approach with user (Firebase Admin SDK selected)
- [x] 3. Add `firebase-admin` dependency to `backend/requirements.txt`
- [x] 4. Add Firebase config vars to `backend/app/core/config.py`
- [x] 5. Create `backend/app/services/firebase_service.py` (Admin SDK + REST fallback)
- [x] 6. Create `backend/app/api/users.py` (GET/POST /users endpoints)
- [x] 7. Register users router in `backend/app/main.py`
- [x] 8. Create customer endpoint + sync customers to Firebase (`customer_service.py`, `api/customers.py`)
- [x] 9. Add Firebase status to health check
- [x] 10. Update frontend ConsentManager to create real customers
- [ ] 11. Install dependencies and test
