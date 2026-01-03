from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Destination, Trip, Activity, Expense
from .serializers import (
    DestinationSerializer, TripSerializer, TripCreateSerializer,
    ActivitySerializer, ExpenseSerializer, UserSerializer
)

class DestinationListView(generics.ListCreateAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

class DestinationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

class TripListView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Trip.objects.filter(user_id=user_id)
        return Trip.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TripCreateSerializer
        return TripSerializer

class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class ActivityListView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    
    def get_queryset(self):
        trip_id = self.request.query_params.get('trip_id')
        if trip_id:
            return Activity.objects.filter(trip_id=trip_id)
        return Activity.objects.all()

class ActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class ExpenseListView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    
    def get_queryset(self):
        trip_id = self.request.query_params.get('trip_id')
        if trip_id:
            return Expense.objects.filter(trip_id=trip_id)
        return Expense.objects.all()

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

@api_view(['GET'])
def trip_summary(request, trip_id):
    try:
        trip = Trip.objects.get(id=trip_id)
        activities_count = trip.activities.count()
        total_expenses = sum(expense.amount for expense in trip.expenses.all())
        
        return Response({
            'trip_id': trip.id,
            'title': trip.title,
            'destination': trip.destination.name,
            'activities_count': activities_count,
            'total_expenses': float(total_expenses),
            'budget': float(trip.budget),
            'budget_remaining': float(trip.budget - total_expenses),
            'status': trip.status
        })
    except Trip.DoesNotExist:
        return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def search_destinations(request):
    query = request.query_params.get('q', '')
    if query:
        destinations = Destination.objects.filter(name__icontains=query)
        serializer = DestinationSerializer(destinations, many=True)
        return Response(serializer.data)
    return Response([])

@api_view(['GET'])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        trips_count = user.trips.count()
        completed_trips = user.trips.filter(status='completed').count()
        
        return Response({
            'user': UserSerializer(user).data,
            'trips_count': trips_count,
            'completed_trips': completed_trips
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)