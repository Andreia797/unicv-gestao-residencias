# Generated by Django 5.2 on 2025-04-05 14:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Edificio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('endereco', models.CharField(max_length=255)),
                ('numeroApartamentos', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Residente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('telefone', models.CharField(blank=True, max_length=20, null=True)),
                ('endereco', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Quarto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(max_length=50, unique=True)),
                ('capacidade', models.IntegerField()),
                ('edificio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.edificio')),
            ],
        ),
        migrations.CreateModel(
            name='Residencia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Nome', models.CharField(max_length=255)),
                ('edificio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.edificio')),
            ],
        ),
        migrations.CreateModel(
            name='Cama',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(max_length=50)),
                ('status', models.CharField(choices=[('Disponível', 'Disponível'), ('Ocupado', 'Ocupado')], default='Disponível', max_length=50)),
                ('quarto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.quarto')),
                ('residente', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.residente')),
            ],
            options={
                'unique_together': {('numero', 'quarto')},
            },
        ),
    ]
