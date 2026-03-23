from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from ..models import Farm, Portfolio, Export
from ..serializers import (
    FarmSerializer,
    ExportSerializer,
    PortfolioUploadSerializer,
    PortfolioSerializer,
)


# ─────────────────────────────────────────────
#  PERMISSIONS
# ─────────────────────────────────────────────

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'farm') and obj.farm is not None:
            return obj.farm.owner == request.user
        if hasattr(obj, 'export') and obj.export.farm is not None:
            return obj.export.farm.owner == request.user
        return False


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def get_farm(view):
    farm_pk = view.kwargs.get('farm_pk')
    if not farm_pk:
        raise NotFound('Farm not found.')
    try:
        return Farm.objects.get(pk=farm_pk)
    except Farm.DoesNotExist:
        raise NotFound('Farm not found.')


def get_export(view):
    export_pk = view.kwargs.get('export_pk')
    farm_pk = view.kwargs.get('farm_pk')
    if not export_pk:
        raise NotFound('Export not found.')
    try:
        return Export.objects.select_related('farm__owner').get(
            pk=export_pk,
            farm_id=farm_pk,
        )
    except Export.DoesNotExist:
        raise NotFound('Export not found.')


# ─────────────────────────────────────────────
#  FARM
# ─────────────────────────────────────────────

class FarmListCreateView(ListCreateAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Farm.objects.select_related('owner').prefetch_related('export__portfolio')
        if self.request.user.profile.role == 'admin':
            return qs
        elif self.request.user.profile.role == 'customer':
            return qs
        return qs.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FarmDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Farm.objects.select_related('owner').prefetch_related('export__portfolio')


# ─────────────────────────────────────────────
#  EXPORT
# ─────────────────────────────────────────────

class ExportListCreateView(ListCreateAPIView):
    serializer_class = ExportSerializer
    permission_classes = [IsAuthenticated]

    def get_farm(self):
        if not hasattr(self, '_farm'):
            self._farm = get_farm(self)
        return self._farm

    def get_queryset(self):
        return (
            Export.objects
            .filter(farm=self.get_farm())
            .prefetch_related('portfolio')
        )

    def perform_create(self, serializer):
        farm = self.get_farm()
        if farm.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not own this farm.')
        serializer.save(farm=farm)


class ExportDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ExportSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_farm(self):
        if not hasattr(self, '_farm'):
            self._farm = get_farm(self)
        return self._farm

    def get_queryset(self):
        return (
            Export.objects
            .filter(farm=self.get_farm())
            .prefetch_related('portfolio')
        )


# ─────────────────────────────────────────────
#  PORTFOLIO
# ─────────────────────────────────────────────

class PortfolioListCreateView(ListCreateAPIView):
    serializer_class = PortfolioUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_export(self):
        if not hasattr(self, '_export'):
            self._export = get_export(self)
        return self._export

    def get_queryset(self):
        return Portfolio.objects.filter(export=self.get_export())

    def get_serializer(self, *args, **kwargs):
        context = self.get_serializer_context()
        context['export'] = self.get_export()
        kwargs['context'] = context

        photos = self.request.data.getlist('photos')
        if photos:
            kwargs['data'] = [{'photo': photo} for photo in photos]
            kwargs['many'] = True

        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()


class PortfolioDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_export(self):
        if not hasattr(self, '_export'):
            self._export = get_export(self)
        return self._export

    def get_queryset(self):
        return Portfolio.objects.filter(export=self.get_export())

    def perform_update(self, serializer):
        serializer.save()