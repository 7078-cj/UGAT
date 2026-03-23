from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer
import os
from django.conf import settings
from ..models import Profile


# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        
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
def registerUserProvider(request):
    if request.user.profile.role != 'admin':
        return Response(
            {'detail': 'Only admins can register service providers.'},
            status=403
        )

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Profile.objects.create(user=user, role='farmer') 
        return Response({'message': 'Farmer registered successfully'}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def test(request):
    
    return Response('Hello')