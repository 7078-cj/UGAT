from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer, CartSerializer
import os
from django.conf import settings
from ..models import Profile, Farm, Cart, Export
from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import NotFound


# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['role'] = user.profile.role

        
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerAdmin(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Profile.objects.create(user=user, role='admin')
        return Response({'message': 'Admin registered successfully'}, status=201)
    return Response(serializer.errors, status=400)   
        
@api_view(['POST'])
def registerUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Profile.objects.create(user=user, role='customer')
        
        return Response({'message': 'User registered successfully'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registerFarmer(request):
    if request.user.profile.role != 'admin':
        return Response(
            {'detail': 'Only admins can register service providers.'},
            status=403
        )

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Profile.objects.create(user=user, role='farmer')
        Farm.objects.create(owner=user, name=f"{user.username}'s farm")
        return Response({'message': 'Farmer registered successfully'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_by_role(request):
    role = request.GET.get('role')

    if not role:
        return Response({'error': 'Role parameter is required'}, status=400)

    users = User.objects.filter(profile__role=role)

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def test(request):
    
    return Response('Hello')

class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class CartListCreateView(ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(customer=self.request.user).select_related('export__farm')

    def perform_create(self, serializer):
        export_id = self.request.data.get('export_id')
        try:
            export = Export.objects.get(id=export_id)
        except Export.DoesNotExist:
            raise NotFound('Export not found.')
        
        serializer.save(customer=self.request.user, export=export)
        
class CartDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(customer=self.request.user).select_related('export__farm')

    def get_object(self):
        obj = super().get_object()
        if obj.customer != self.request.user:
            raise NotFound('Cart item not found.')
        return obj
    
class UserProfileView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def has_object_permission(self, request, view, obj):
        return obj == request.user

