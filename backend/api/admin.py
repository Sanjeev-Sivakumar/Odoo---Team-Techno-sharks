from django.contrib import admin
from .models import Destination, Trip, Activity, Expense

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'created_at']
    search_fields = ['name', 'country']
    list_filter = ['country', 'created_at']

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'user', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'start_date', 'destination__country']
    search_fields = ['title', 'user__username', 'destination__name']
    date_hierarchy = 'start_date'

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['name', 'trip', 'activity_type', 'date', 'cost']
    list_filter = ['activity_type', 'date']
    search_fields = ['name', 'trip__title']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'trip', 'category', 'amount', 'date']
    list_filter = ['category', 'date']
    search_fields = ['description', 'trip__title']