from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('farmer', 'Farmer'),
        ('customer', 'Customer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile",)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.user.username

class Farm(models.Model):
    owner = models.ForeignKey(User, related_name='farm', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=1000, blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    def __str__(self):
        return self.name
    

    
class Export(models.Model):
    QUALITY_CHOICES = [
        ('poor',      'Poor'),
        ('fair',      'Fair'),
        ('good',      'Good'),
        ('excellent', 'Excellent'),
    ]

    SOIL_CHOICES = [
        ('sandy', 'Sandy'),
        ('loamy', 'Loamy'),
        ('clay',  'Clay'),
        ('silty', 'Silty'),
        ('peaty', 'Peaty'),
        ('chalky','Chalky'),
    ]

    farm        = models.ForeignKey(Farm, related_name='export', on_delete=models.CASCADE)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    stocks      = models.DecimalField(max_digits=10, decimal_places=2)
    quality     = models.CharField(max_length=20, choices=QUALITY_CHOICES, blank=True, null=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    soil_quality= models.CharField(max_length=20, choices=SOIL_CHOICES, blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.created_at)
    
class Portfolio(models.Model):
    export = models.ForeignKey(Export, related_name='portfolio', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="portfolios/", blank=True, null=True)
    
    def __str__(self):
        return self.photo.name if self.photo else "No Photo" 