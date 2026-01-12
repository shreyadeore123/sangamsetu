from rest_framework import serializers
from .models import MatchSuggestion, MissingPerson, FoundPerson

class MissingPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissingPerson
        fields = "__all__"

class FoundPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundPerson
        fields = [
            "id",
            "name",
            "approx_age",
            "gender",
            "found_location",
            "current_location",
            "finder_contact",
            "description",
            "created_at",
        ]

class MatchSuggestionSerializer(serializers.ModelSerializer):
    missing_person = MissingPersonSerializer(read_only=True)
    found_person = FoundPersonSerializer(read_only=True)

    class Meta:
        model = MatchSuggestion
        fields = "__all__"
