from django.db import models
from django.conf import settings
from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated

User = settings.AUTH_USER_MODEL


# ------------------- MODELS -------------------
class FoundPerson(models.Model):
    name = models.CharField(max_length=100)
    approx_age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    found_location = models.CharField(max_length=255)
    current_location = models.CharField(max_length=255, null=True, blank=True)
    finder_contact = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class MissingPerson(models.Model):
    name = models.CharField(max_length=100)
    approx_age = models.IntegerField()
    gender = models.CharField(max_length=10)
    last_seen_location = models.CharField(max_length=255)
    last_seen_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    def __str__(self):
        return f"{self.name} ({self.approx_age}, {self.gender})"

    created_at = models.DateTimeField(auto_now_add=True)
class MatchSuggestion(models.Model):
    missing_person = models.ForeignKey(
        MissingPerson,
        on_delete=models.CASCADE,
        related_name="matches"
    )
    found_person = models.ForeignKey(
        FoundPerson,
        on_delete=models.CASCADE,
        related_name="matches"
    )
    confidence = models.FloatField(default=0.0)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)



class Case(models.Model):
    missing_person = models.ForeignKey(MissingPerson, on_delete=models.CASCADE)
    found_person = models.ForeignKey(FoundPerson, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Case {self.id}"


# ------------------- SERIALIZERS -------------------
class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['id', 'missing_person', 'found_person', 'created_by', 'created_at']


# ------------------- VIEWSETS -------------------
class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

