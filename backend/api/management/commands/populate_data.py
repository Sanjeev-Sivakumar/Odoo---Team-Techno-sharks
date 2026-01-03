from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Destination, Trip, Activity, Expense
from datetime import date, timedelta
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create sample destinations
        destinations_data = [
            {'name': 'Paris', 'country': 'France', 'description': 'City of Light'},
            {'name': 'Tokyo', 'country': 'Japan', 'description': 'Modern metropolis'},
            {'name': 'New York', 'country': 'USA', 'description': 'The Big Apple'},
            {'name': 'London', 'country': 'UK', 'description': 'Historic capital'},
            {'name': 'Bali', 'country': 'Indonesia', 'description': 'Tropical paradise'},
        ]

        for dest_data in destinations_data:
            destination, created = Destination.objects.get_or_create(
                name=dest_data['name'],
                defaults=dest_data
            )
            if created:
                self.stdout.write(f'Created destination: {destination.name}')

        # Create sample user if doesn't exist
        user, created = User.objects.get_or_create(
            username='demo_user',
            defaults={
                'email': 'demo@example.com',
                'first_name': 'Demo',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('demo123')
            user.save()
            self.stdout.write('Created demo user')

        # Create sample trips
        paris = Destination.objects.get(name='Paris')
        trip, created = Trip.objects.get_or_create(
            title='Paris Adventure',
            user=user,
            destination=paris,
            defaults={
                'start_date': date.today() + timedelta(days=30),
                'end_date': date.today() + timedelta(days=37),
                'budget': Decimal('2500.00'),
                'status': 'planned'
            }
        )
        if created:
            self.stdout.write('Created sample trip')

        self.stdout.write(self.style.SUCCESS('Successfully populated sample data'))