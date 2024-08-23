from rest_framework import permissions


class IsTrainerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        try:
            return request.user.trainer is not None
        except AttributeError:
            return False
