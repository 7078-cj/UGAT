from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer
import os
from django.conf import settings
from ..models import Profile, Farm
from django.contrib.auth.models import User


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