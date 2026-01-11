from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
from bson.objectid import ObjectId

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todos_collection = db['todos']

logger = logging.getLogger(__name__)

class TodoListView(APIView):
    """
    API View for managing TODO items.
    Handles GET (retrieve all) and POST (create new) operations.
    """

    def get(self, request):
        """
        Retrieve all TODO items from MongoDB.
        
        Returns:
            Response: JSON array of todos with HTTP 200 status
        """
        try:
            todos = list(todos_collection.find({}))
            
            # Convert ObjectId to string for JSON serialization
            for todo in todos:
                todo['_id'] = str(todo['_id'])
            
            logger.info(f"Successfully fetched {len(todos)} todos")
            return Response(todos, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error fetching todos: {str(e)}")
            return Response(
                {'error': 'Failed to fetch todos', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Create a new TODO item in MongoDB.
        """
        try:
            data = request.data

            # Validate required fields
            if not data.get('description'):
                return Response(
                    {'error': 'Description field is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            description = str(data.get('description', '')).strip()

            if not description:
                return Response(
                    {'error': 'Description cannot be empty or whitespace only'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create todo document (no status field)
            todo_document = {
                'description': description
            }

            # Insert into MongoDB
            result = todos_collection.insert_one(todo_document)

            # Return created todo with ID
            created_todo = {
                '_id': str(result.inserted_id),
                'description': description
            }

            logger.info(f"Successfully created todo with ID: {result.inserted_id}")
            return Response(created_todo, status=status.HTTP_201_CREATED)

        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response(
                {'error': 'Invalid request data', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Error creating todo: {str(e)}")
            return Response(
                {'error': 'Failed to create todo', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

