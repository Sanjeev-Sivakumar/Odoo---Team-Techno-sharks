# Globetrotter Backend API

Django REST API backend for the Globetrotter travel planning application.

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Run the setup script:
```bash
setup.bat
```

Or manually:
```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py populate_data
```

4. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Destinations
- `GET /api/destinations/` - List all destinations
- `POST /api/destinations/` - Create new destination
- `GET /api/destinations/{id}/` - Get destination details
- `GET /api/destinations/search/?q={query}` - Search destinations

### Trips
- `GET /api/trips/` - List trips (filter by user_id)
- `POST /api/trips/` - Create new trip
- `GET /api/trips/{id}/` - Get trip details
- `GET /api/trips/{id}/summary/` - Get trip summary with expenses

### Activities
- `GET /api/activities/` - List activities (filter by trip_id)
- `POST /api/activities/` - Create new activity
- `GET /api/activities/{id}/` - Get activity details

### Expenses
- `GET /api/expenses/` - List expenses (filter by trip_id)
- `POST /api/expenses/` - Create new expense
- `GET /api/expenses/{id}/` - Get expense details

### Users
- `GET /api/users/{id}/profile/` - Get user profile with stats

## Models

- **Destination**: Travel destinations with name, country, description
- **Trip**: User trips with dates, budget, status
- **Activity**: Trip activities with type, date, cost
- **Expense**: Trip expenses with category, amount, date

## Admin Interface

Access Django admin at `http://localhost:8000/admin/`
Create superuser: `python manage.py createsuperuser`