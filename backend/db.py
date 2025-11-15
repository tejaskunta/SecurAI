"""
MongoDB Database Layer
Handles audit logging without storing raw PII
"""
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "securai")

# Global MongoDB client
mongo_client = None
db = None


def get_db():
    """Get database instance"""
    global mongo_client, db
    
    if mongo_client is None:
        mongo_client = AsyncIOMotorClient(MONGO_URI)
        db = mongo_client[MONGO_DB]
    
    return db


async def save_audit_log(log_data: dict) -> bool:
    """
    Save audit log to MongoDB
    NEVER stores raw PII - only metadata
    
    Args:
        log_data: Dict containing:
            - privacy_score
            - entity_types (list)
            - entity_count
            - input_length
            - output_length
            - redacted_text_sample (first 100 chars only)
    
    Returns:
        True if successful
    """
    try:
        database = get_db()
        collection = database.audit_logs
        
        # Add timestamp
        log_entry = {
            "timestamp": datetime.utcnow(),
            **log_data
        }
        
        await collection.insert_one(log_entry)
        return True
        
    except Exception as e:
        print(f"Error saving audit log: {str(e)}")
        # Don't raise - logging should not break the main flow
        return False


async def get_recent_logs(limit: int = 50):
    """
    Retrieve recent audit logs
    
    Args:
        limit: Maximum number of logs to return
    
    Returns:
        List of log entries
    """
    try:
        database = get_db()
        collection = database.audit_logs
        
        cursor = collection.find().sort("timestamp", -1).limit(limit)
        logs = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for log in logs:
            if "_id" in log:
                log["_id"] = str(log["_id"])
            if "timestamp" in log:
                log["timestamp"] = log["timestamp"].isoformat()
        
        return logs
        
    except Exception as e:
        print(f"Error retrieving logs: {str(e)}")
        return []


async def close_db_connection():
    """Close database connection"""
    global mongo_client
    
    if mongo_client:
        mongo_client.close()
        mongo_client = None
