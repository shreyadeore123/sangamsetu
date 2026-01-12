from rest_framework.permissions import BasePermission

class IsVolunteerOrPolice(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name="VOLUNTEER").exists()
        )
    

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == "ADMIN"
        )

class IsReporter(BasePermission):
    def has_permission(self, request, view):
        # Allow only users with role 'reporter'
        return hasattr(request.user, 'role') and request.user.role == 'reporter'

class IsCreatorOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow if user is superuser or the one who created the match
        return request.user.is_superuser or request.user == obj.missing_person.reported_by


class IsPoliceOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(
                name__in=["POLICE", "ADMIN"]
            ).exists()
        )
