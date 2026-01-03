@echo off
echo Setting up Django backend...

echo Installing dependencies...
pip install -r requirements.txt

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Creating superuser (optional)...
echo You can create a superuser by running: python manage.py createsuperuser

echo Populating sample data...
python manage.py populate_data

echo Setup complete! Run 'python manage.py runserver' to start the server.