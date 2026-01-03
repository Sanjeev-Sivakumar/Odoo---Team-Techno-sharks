from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Destination, Trip, Activity, Expense

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    total_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'

    def get_total_expenses(self, obj):
        return sum(expense.amount for expense in obj.expenses.all())

class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['title', 'destination', 'start_date', 'end_date', 'budget', 'status']