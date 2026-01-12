from django.contrib import admin
from .models import MissingPerson, FoundPerson, MatchSuggestion

admin.site.register(MissingPerson)
admin.site.register(FoundPerson)
admin.site.register(MatchSuggestion)

