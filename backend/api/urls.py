from django.urls import path
from . import views

urlpatterns = [
    # Destinations
    path('destinations/', views.DestinationListView.as_view(), name='destination-list'),
    path('destinations/<int:pk>/', views.DestinationDetailView.as_view(), name='destination-detail'),
    path('destinations/search/', views.search_destinations, name='destination-search'),
    
    # Trips
    path('trips/', views.TripListView.as_view(), name='trip-list'),
    path('trips/<int:pk>/', views.TripDetailView.as_view(), name='trip-detail'),
    path('trips/<int:trip_id>/summary/', views.trip_summary, name='trip-summary'),
    
    # Activities
    path('activities/', views.ActivityListView.as_view(), name='activity-list'),
    path('activities/<int:pk>/', views.ActivityDetailView.as_view(), name='activity-detail'),
    
    # Expenses
    path('expenses/', views.ExpenseListView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
    
    # User Profile
    path('users/<int:user_id>/profile/', views.user_profile, name='user-profile'),
]