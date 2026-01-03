from django.db import models
from django.contrib.auth.models import User

class Destination(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}, {self.country}"

class Trip(models.Model):
    TRIP_STATUS = [
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=TRIP_STATUS, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.destination.name}"

class Activity(models.Model):
    ACTIVITY_TYPES = [
        ('sightseeing', 'Sightseeing'),
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
        ('food', 'Food & Dining'),
        ('shopping', 'Shopping'),
        ('relaxation', 'Relaxation'),
    ]
    
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.name} - {self.trip.title}"

class Expense(models.Model):
    EXPENSE_CATEGORIES = [
        ('transport', 'Transportation'),
        ('accommodation', 'Accommodation'),
        ('food', 'Food'),
        ('activities', 'Activities'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    ]
    
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES)
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - ${self.amount}"