from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Portfolio, Farm, Export


class UserSerializer(serializers.ModelSerializer):
    """Used for registration only"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class PublicUserSerializer(serializers.ModelSerializer):
    """Used for read-only owner display in nested serializers"""
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'photo']


class PortfolioBulkSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        export = self.context.get('export')
        portfolios = [
            Portfolio(export=export, photo=item['photo'])
            for item in validated_data
        ]
        return Portfolio.objects.bulk_create(portfolios)


class PortfolioUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['photo']
        list_serializer_class = PortfolioBulkSerializer

    def validate_photo(self, value):
        allowed_types = ['image/jpeg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only JPEG, PNG, and WebP images are allowed.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 5MB.")
        return value


class ExportSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer(many=True, read_only=True)

    class Meta:
        model = Export
        fields = [
            'id', 'price', 'stocks',
            'quality', 'temperature', 'soil_quality',
            'created_at', 'portfolio',
        ]


class FarmSerializer(serializers.ModelSerializer):
    owner = PublicUserSerializer(read_only=True)
    export = ExportSerializer(many=True, read_only=True)

    class Meta:
        model = Farm
        fields = ['id', 'owner', 'name', 'description',
                'address', 'latitude', 'longitude', 'export']