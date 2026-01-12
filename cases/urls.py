from django.urls import path, include
from .views import (
    MissingPersonCreateView,
    FoundPersonCreateView,
    FoundCaseView,
    MatchListView,
    ConfirmMatchView,
    DashboardStatsView,
)
from .views import dashboard_stats

urlpatterns = [
    path("missing/", MissingPersonCreateView.as_view(), name="missing-create"),
    path('found/', FoundCaseView.as_view(), name='cases-found'),
    path("matches/", MatchListView.as_view(), name="match-list"),
    path("matches/<int:pk>/confirm/", ConfirmMatchView.as_view(), name="confirm-match"),
    path('dashboard/', DashboardStatsView.as_view()),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
]

