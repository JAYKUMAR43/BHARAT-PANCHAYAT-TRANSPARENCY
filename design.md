# BHARAT PANCHAYAT TRANSPARENCY — System Design

## Architecture
Frontend (React) → FastAPI Backend → SQLite Database

## Modules

### Location Module
Handles State, District and Village selection.

### Complaint Module
Handles complaint submission and storage.

### Feedback Module
Stores citizen feedback.

### Admin Module
Allows authority to update complaint status.

## API Flow
User Request → API Endpoint → Database → Response → UI Update

## Database Tables
- states
- districts
- villages
- complaints
- feedback

## Security
- Input validation
- Controlled API access
