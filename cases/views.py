from re import Match
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Case
from .models import MissingPerson, FoundPerson, MatchSuggestion
from .serializers import (
    MissingPersonSerializer,
    FoundPersonSerializer,
    MatchSuggestionSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MissingPerson, FoundPerson

from .permissions import IsAdminRole, IsVolunteerOrPolice, IsPoliceOrAdmin
from .utils import calculate_confidence
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class MissingPersonCreateView(generics.CreateAPIView):
    serializer_class = MissingPersonSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
class FoundPersonCreateView(generics.CreateAPIView):
    serializer_class = FoundPersonSerializer
    permission_classes = [IsVolunteerOrPolice]

    def perform_create(self, serializer):
        found = serializer.save(reported_by=self.request.user)

        missing_cases = MissingPerson.objects.filter(is_found=False)

        for missing in missing_cases:
            confidence = calculate_confidence(missing, found)
            if confidence >= 0.6:
                MatchSuggestion.objects.create(
                    missing_person=missing,
                    found_person=found,
                    confidence=confidence
                )

class MatchListView(generics.ListAPIView):
    serializer_class = MatchSuggestionSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        queryset = MatchSuggestion.objects.select_related(
            "missing_person",
            "found_person"
        )

        min_conf = self.request.query_params.get("min_confidence")
        confirmed = self.request.query_params.get("confirmed")

        if min_conf:
            queryset = queryset.filter(confidence__gte=min_conf)

        if confirmed is not None:
            queryset = queryset.filter(
                is_confirmed=confirmed.lower() == "true"
            )

        return queryset

class FoundCaseView(APIView):
    def post(self, request):
        # your logic here
        return Response({"message": "Case found!"}, status=status.HTTP_200_OK)



class ConfirmMatchView(APIView):
    permission_classes = [IsPoliceOrAdmin]

    def post(self, request, pk):
        match = get_object_or_404(MatchSuggestion, pk=pk)

        if match.is_confirmed:
            return Response(
                {"detail": "Match already confirmed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        match.is_confirmed = True
        match.save()

        return Response(
            {"detail": "Match confirmed"},
            status=status.HTTP_200_OK
        )

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "total_cases": 10,
            "lost_cases": 9,
            "found_cases": 7
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    return Response({
        "missing_count": MissingPerson.objects.count(),
        "found_count": FoundPerson.objects.count(),
        "match_count": MatchSuggestion.objects.count(),
    })
