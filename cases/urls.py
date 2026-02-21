from django.urls import path, include
from .views import (
    MissingPersonCreateView,
    FoundPersonCreateView,
    MatchListView,
    ConfirmMatchView,
    RejectMatchView,
    DashboardStatsView,
)
from .views import dashboard_stats

urlpatterns = [
    path("missing/", MissingPersonCreateView.as_view(), name="missing-create"),
    path("found/", FoundPersonCreateView.as_view(), name="found-create"),
    path("matches/", MatchListView.as_view(), name="match-list"),
    path("matches/<int:pk>/confirm/", ConfirmMatchView.as_view(), name="confirm-match"),
    path("matches/<int:pk>/reject/", RejectMatchView.as_view(), name="reject-match"),
    path('dashboard/', DashboardStatsView.as_view()),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
]

