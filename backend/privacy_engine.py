"""
Privacy Engine - PII Detection and Redaction using Presidio
Uses pattern-based detection with custom recognizers for plain formats
"""
from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from typing import List, Dict
import re

# Configure NLP engine with spaCy for better name recognition
nlp_configuration = {
    "nlp_engine_name": "spacy",
    "models": [{"lang_code": "en", "model_name": "en_core_web_lg"}],
}
nlp_engine = NlpEngineProvider(nlp_configuration=nlp_configuration).create_engine()

# Custom recognizer for plain phone numbers (e.g., 555-0123, 555 0123, 5550123)
phone_recognizer = PatternRecognizer(
    supported_entity="PHONE_NUMBER",
    name="plain_phone_recognizer",
    patterns=[
        Pattern(name="phone_plain", regex=r"\b\d{3}[-\s]?\d{4}\b", score=0.7),  # 555-0123 or 555 0123
        Pattern(name="phone_standard", regex=r"\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b", score=0.8),  # 555-012-3456
        Pattern(name="phone_parens", regex=r"\(\d{3}\)\s?\d{3}[-\s]?\d{4}\b", score=0.9),  # (555) 012-3456
        Pattern(name="indian_phone", regex=r"\+?91[-\s]?\d{10}\b", score=0.9),  # +91 9876543210
        Pattern(name="indian_phone_plain", regex=r"\b[6-9]\d{9}\b", score=0.75),  # 9876543210 (Indian mobile)
    ],
)

# Custom recognizer for occupations/job titles - CASE-INSENSITIVE
occupation_recognizer = PatternRecognizer(
    supported_entity="OCCUPATION",
    name="occupation_recognizer",
    patterns=[
        Pattern(
            name="occupation_context",
            regex=r"(?i)\b(?:works?\s+as|job\s+is|occupation\s+is|profession\s+is|employed\s+as|position\s+is|role\s+is|title\s+is|i\s+am\s+a|i'm\s+a)\s+(?:a\s+|an\s+)?([a-z][a-z\s]{2,30}?)(?=\s+at|\s+in|\s+for|\.|,|$)",
            score=0.85
        ),
        Pattern(
            name="occupation_title",
            regex=r"(?i)\b(software\s+engineer|data\s+scientist|product\s+manager|designer|developer|teacher|doctor|nurse|lawyer|accountant|engineer|manager|consultant|analyst|architect|ceo|cto|cfo|director|professor|researcher|student)\b",
            score=0.80
        ),
    ],
)

# Custom recognizer for organizations/companies - CASE-INSENSITIVE
organization_recognizer = PatternRecognizer(
    supported_entity="ORGANIZATION",
    name="organization_recognizer",
    patterns=[
        Pattern(
            name="org_context",
            regex=r"(?i)\b(?:works?\s+at|works?\s+for|employed\s+at|employed\s+by|company\s+is|organization\s+is)\s+([A-Za-z][A-Za-z0-9\s&.]{2,40})(?=\.|,|$|\s+as|\s+in)",
            score=0.85
        ),
        Pattern(
            name="org_suffix",
            regex=r"\b([A-Z][A-Za-z0-9\s&.]{2,40})\s+(?:Inc\.?|LLC|Ltd\.?|Corporation|Corp\.?|Company|Co\.?|Technologies|Tech|Systems|Solutions|Services|Group|International|Pvt\.?\s+Ltd\.?|Limited)\b",
            score=0.90
        ),
    ],
)

# Custom recognizer for US addresses (street number + street + city + state + zip) - CASE-INSENSITIVE
address_recognizer = PatternRecognizer(
    supported_entity="LOCATION",
    name="address_recognizer",
    patterns=[
        # Full address with zip: 123 Main St, New York, NY 10001
        Pattern(
            name="full_address_zip",
            regex=r"(?i)\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|place|pl)[\s,]+[A-Za-z\s]+[\s,]+[A-Z]{2}[\s,]+\d{5}(?:-\d{4})?\b",
            score=0.95
        ),
        # Address without state: 123 Main St, New York 10001
        Pattern(
            name="address_city_zip",
            regex=r"(?i)\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|place|pl)[\s,]+[A-Za-z\s]+[\s,]+\d{5}(?:-\d{4})?\b",
            score=0.9
        ),
        # Simple street address with number: 123 Main Street
        Pattern(
            name="street_address",
            regex=r"(?i)\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|place|pl)\b",
            score=0.75
        ),
    ],
)

# Custom recognizer for Indian Aadhaar numbers (12 digits, format: 1234 5678 9012)
aadhaar_recognizer = PatternRecognizer(
    supported_entity="IN_AADHAAR",
    name="aadhaar_recognizer",
    patterns=[
        Pattern(name="aadhaar_spaced", regex=r"\b\d{4}\s\d{4}\s\d{4}\b", score=0.9),  # 1234 5678 9012
        Pattern(name="aadhaar_plain", regex=r"\b\d{12}\b", score=0.6),  # 123456789012
    ],
)

# Custom recognizer for Indian PAN Card (Format: ABCDE1234F) - CASE-INSENSITIVE
pan_recognizer = PatternRecognizer(
    supported_entity="IN_PAN",
    name="pan_recognizer",
    patterns=[
        Pattern(name="pan_card", regex=r"(?i)\b[A-Z]{5}\d{4}[A-Z]\b", score=0.95),  # ABCDE1234F or abcde1234f
    ],
)

# Custom recognizer for Indian Vehicle Registration (Format: DL01AB1234, MH02CD5678) - CASE-INSENSITIVE
vehicle_reg_recognizer = PatternRecognizer(
    supported_entity="IN_VEHICLE_REGISTRATION",
    name="vehicle_registration_recognizer",
    patterns=[
        Pattern(name="vehicle_reg", regex=r"(?i)\b[A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{1,2}[-\s]?\d{4}\b", score=0.85),
    ],
)

# Custom recognizer for Indian Passport (Format: A1234567, Z9876543) - CASE-INSENSITIVE
passport_recognizer = PatternRecognizer(
    supported_entity="IN_PASSPORT",
    name="passport_recognizer",
    patterns=[
        Pattern(name="indian_passport", regex=r"(?i)\b[A-Z]\d{7}\b", score=0.9),
    ],
)

# Custom recognizer for Indian Voter ID (Format: ABC1234567) - CASE-INSENSITIVE
voter_id_recognizer = PatternRecognizer(
    supported_entity="IN_VOTER_ID",
    name="voter_id_recognizer",
    patterns=[
        Pattern(name="voter_id", regex=r"(?i)\b[A-Z]{3}\d{7}\b", score=0.85),
    ],
)

# Initialize Presidio engines with custom recognizers and NLP
analyzer = AnalyzerEngine(nlp_engine=nlp_engine, supported_languages=["en"])
analyzer.registry.add_recognizer(phone_recognizer)
analyzer.registry.add_recognizer(address_recognizer)
analyzer.registry.add_recognizer(aadhaar_recognizer)
analyzer.registry.add_recognizer(pan_recognizer)
analyzer.registry.add_recognizer(vehicle_reg_recognizer)
analyzer.registry.add_recognizer(passport_recognizer)
analyzer.registry.add_recognizer(voter_id_recognizer)
analyzer.registry.add_recognizer(occupation_recognizer)
analyzer.registry.add_recognizer(organization_recognizer)
anonymizer = AnonymizerEngine()

# Entity weights for privacy score calculation
ENTITY_WEIGHTS = {
    "PERSON": 15,
    "EMAIL_ADDRESS": 20,
    "PHONE_NUMBER": 18,
    "CREDIT_CARD": 25,
    "CRYPTO": 25,
    "IBAN_CODE": 25,
    "IP_ADDRESS": 12,
    "LOCATION": 10,
    "DATE_TIME": 5,
    "URL": 8,
    "US_SSN": 30,
    "US_DRIVER_LICENSE": 20,
    "US_PASSPORT": 25,
    "MEDICAL_LICENSE": 22,
    "NRP": 15,
    "US_BANK_NUMBER": 25,
    "AU_ABN": 20,
    "AU_ACN": 20,
    "AU_TFN": 25,
    "AU_MEDICARE": 25,
    # Indian PII
    "IN_AADHAAR": 30,
    "IN_PAN": 25,
    "IN_PASSPORT": 25,
    "IN_VOTER_ID": 20,
    "IN_VEHICLE_REGISTRATION": 15,
    # Professional Information
    "OCCUPATION": 12,
    "ORGANIZATION": 14,
}


def resolve_entity_conflicts(entities: List[Dict]) -> List[Dict]:
    """
    Resolve conflicts when entities overlap
    Priority: PERSON > EMAIL > PHONE > other entities > LOCATION
    
    Args:
        entities: List of detected entities
    
    Returns:
        List of entities with conflicts resolved
    """
    if not entities:
        return entities
    
    # Define priority order (higher number = higher priority)
    priority = {
        "PERSON": 100,
        "EMAIL_ADDRESS": 90,
        "PHONE_NUMBER": 80,
        "IN_AADHAAR": 75,
        "IN_PAN": 75,
        "IN_PASSPORT": 75,
        "CREDIT_CARD": 70,
        "US_SSN": 70,
        "OCCUPATION": 20,
        "ORGANIZATION": 20,
        "LOCATION": 10,  # Lowest priority
    }
    
    # Sort by start position
    sorted_entities = sorted(entities, key=lambda e: e["start"])
    resolved = []
    
    for entity in sorted_entities:
        # Check if this entity overlaps with any already resolved entity
        overlaps = False
        for resolved_entity in resolved:
            # Check for overlap
            if (entity["start"] < resolved_entity["end"] and 
                entity["end"] > resolved_entity["start"]):
                # There's an overlap - keep the higher priority entity
                entity_priority = priority.get(entity["entity_type"], 50)
                resolved_priority = priority.get(resolved_entity["entity_type"], 50)
                
                if entity_priority > resolved_priority:
                    # Replace the resolved entity with this one
                    resolved.remove(resolved_entity)
                    resolved.append(entity)
                overlaps = True
                break
        
        if not overlaps:
            resolved.append(entity)
    
    return sorted(resolved, key=lambda e: e["start"])


def merge_adjacent_locations(entities: List[Dict], text: str, max_gap: int = 15) -> List[Dict]:
    """
    Merge adjacent LOCATION entities into single address entities
    Also includes nearby numbers (like zip codes) that are part of addresses
    
    Args:
        entities: List of detected entities
        text: Original text
        max_gap: Maximum character gap between locations to merge
    
    Returns:
        List of entities with merged locations
    """
    if not entities:
        return entities
    
    # Sort entities by start position
    sorted_entities = sorted(entities, key=lambda e: e["start"])
    merged = []
    i = 0
    
    while i < len(sorted_entities):
        current = sorted_entities[i]
        
        # If not a location, add as-is
        if current["entity_type"] != "LOCATION":
            merged.append(current)
            i += 1
            continue
        
        # Start merging locations
        merge_start = current["start"]
        merge_end = current["end"]
        merge_score = current["score"]
        
        # Look ahead for more locations within max_gap
        j = i + 1
        while j < len(sorted_entities):
            next_entity = sorted_entities[j]
            gap = next_entity["start"] - merge_end
            
            # Check if next entity is a location within max_gap characters
            if next_entity["entity_type"] == "LOCATION" and gap <= max_gap:
                merge_end = next_entity["end"]
                merge_score = max(merge_score, next_entity["score"])
                j += 1
            else:
                break
        
        # Check for trailing numbers (like zip codes) after the last location
        # Look for 4-6 digit numbers within 5 characters after the location
        trailing_text = text[merge_end:min(merge_end + 10, len(text))]
        zip_match = re.search(r'^[\s,]*(\d{4,6})\b', trailing_text)
        if zip_match:
            # Include the zip code in the merged location
            merge_end = merge_end + zip_match.end()
        
        # Create merged entity
        merged_entity = {
            "entity_type": "LOCATION",
            "start": merge_start,
            "end": merge_end,
            "score": round(merge_score, 2),
            "text": text[merge_start:merge_end]
        }
        merged.append(merged_entity)
        i = j
    
    return merged


def detect_contextual_names(text: str, existing_entities: List[Dict]) -> List[Dict]:
    """
    Detect names based on context clues that Presidio/spaCy might miss
    Looks for patterns like "My name is X", "I am X", "called X", etc.
    Especially useful for Indian names that may not be in NLP models
    NOW CASE-INSENSITIVE: Will detect "bob", "Bob", "BOB" equally
    
    Args:
        text: Original text
        existing_entities: Already detected entities
    
    Returns:
        List of additional name entities found through context
    """
    additional_entities = []
    
    # Context patterns for names - NOW CASE-INSENSITIVE with (?i) flag
    # Will capture 1-2 words after context phrases regardless of capitalization
    # Handles various punctuation and spacing issues
    name_patterns = [
        (r"(?i)(?:my name is|my name's)\s+([a-z][a-z\s]+?)(?=\s+and|\s+from|\s+works?|\.|,|$)", 0.95),
        (r"(?i)(?:I am|I'm)\s+([a-z][a-z\s]+?)(?=\s+and|\s+from|\s+a\s+|\.|,|$)", 0.85),
        (r"(?i)(?:call me|called)\s+([a-z][a-z\s]+?)(?=\s+and|\s+from|\.|,|$)", 0.9),
        (r"(?i)(?:this is|meet)\s+([a-z][a-z\s]+?)(?=\s+from|\s+who|\.|,|$)", 0.85),
        (r"(?i)(?:named)\s+([a-z][a-z\s]+?)(?=\s+from|\.|,|$)", 0.85),
        (r"(?i)(?:hi|hello|hey),?\s+(?:i'm|i am|this is)\s+([a-z][a-z\s]+?)(?=\s+and|\s+from|\.|,|$)", 0.9),
        # Handle "from" location patterns
        (r"(?i)\b([a-z][a-z\s]+?)\s+from\s+([a-z]+)", 0.90),  # "tejas from hyderabad"
    ]
    
    for pattern, score in name_patterns:
        for match in re.finditer(pattern, text):
            name = match.group(1).strip()
            start = match.start(1)
            end = match.end(1)
            
            # Validate the name doesn't contain common words that aren't names
            stop_words = ['and', 'the', 'is', 'at', 'to', 'for', 'of', 'in', 'on', 'my', 'email', 'with', 
                         'here', 'there', 'what', 'how', 'when', 'where', 'why', 'who', 'can', 'will',
                         'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'be', 'am', 'are',
                         'works', 'work', 'working']
            name_lower = name.lower().strip()
            
            # Skip if name is a stop word, too short, or contains email-related text
            if name_lower in stop_words or 'email' in name_lower or len(name_lower) <= 1:
                continue
            
            # Check if this position overlaps with existing PERSON entity
            already_has_person = False
            for entity in existing_entities:
                if (entity["entity_type"] == "PERSON" and 
                    ((entity["start"] <= start < entity["end"]) or 
                     (start <= entity["start"] < end))):
                    already_has_person = True
                    break
            
            if not already_has_person:
                additional_entities.append({
                    "entity_type": "PERSON",
                    "start": start,
                    "end": end,
                    "score": score,
                    "text": name
                })
    
    return additional_entities


def analyze_text(text: str, language: str = "en") -> Dict:
    """
    Analyze text for PII entities and return redacted version
    Enhanced with custom recognizers for plain phone numbers
    
    Args:
        text: Input text to analyze
        language: Language code (default: "en")
    
    Returns:
        Dict containing:
            - entities: List of detected entities
            - redacted_text: Text with PII replaced by placeholders
    """
    # Step 1: Analyze with Presidio (pattern-based recognizers)
    analyzer_results = analyzer.analyze(
        text=text,
        language=language,
        entities=None  # Detect all entity types
    )
    
    # Step 2: Format entities for response
    entities = []
    for result in analyzer_results:
        entity = {
            "entity_type": result.entity_type,
            "start": result.start,
            "end": result.end,
            "score": round(result.score, 2),
            "text": text[result.start:result.end]
        }
        entities.append(entity)
    
    # Step 2.1: Add contextual names that might have been missed
    contextual_names = detect_contextual_names(text, entities)
    entities.extend(contextual_names)
    
    # Step 2.5: Resolve conflicts (prioritize PERSON over LOCATION)
    entities = resolve_entity_conflicts(entities)
    
    # Step 3: Merge adjacent locations into single addresses
    entities = merge_adjacent_locations(entities, text)
    
    # Step 4: Convert entities back to RecognizerResult for anonymizer
    from presidio_analyzer import RecognizerResult
    updated_results = []
    for entity in entities:
        result = RecognizerResult(
            entity_type=entity["entity_type"],
            start=entity["start"],
            end=entity["end"],
            score=entity["score"]
        )
        updated_results.append(result)
    
    # Step 5: Anonymize/Redact the text using updated results
    anonymized_result = anonymizer.anonymize(
        text=text,
        analyzer_results=updated_results,
        operators={
            "DEFAULT": OperatorConfig("replace", {"new_value": "[{entity_type}]"}),
            "PERSON": OperatorConfig("replace", {"new_value": "[PERSON]"}),
            "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "[EMAIL]"}),
            "PHONE_NUMBER": OperatorConfig("replace", {"new_value": "[PHONE]"}),
            "CREDIT_CARD": OperatorConfig("replace", {"new_value": "[CREDIT_CARD]"}),
            "LOCATION": OperatorConfig("replace", {"new_value": "[LOCATION]"}),
            "DATE_TIME": OperatorConfig("replace", {"new_value": "[DATE]"}),
            "IP_ADDRESS": OperatorConfig("replace", {"new_value": "[IP_ADDRESS]"}),
            "URL": OperatorConfig("replace", {"new_value": "[URL]"}),
            # Indian PII redactions
            "IN_AADHAAR": OperatorConfig("replace", {"new_value": "[AADHAAR]"}),
            "IN_PAN": OperatorConfig("replace", {"new_value": "[PAN]"}),
            "IN_PASSPORT": OperatorConfig("replace", {"new_value": "[PASSPORT]"}),
            "IN_VOTER_ID": OperatorConfig("replace", {"new_value": "[VOTER_ID]"}),
            "IN_VEHICLE_REGISTRATION": OperatorConfig("replace", {"new_value": "[VEHICLE_REG]"}),
            # Professional Information
            "OCCUPATION": OperatorConfig("replace", {"new_value": "[OCCUPATION]"}),
            "ORGANIZATION": OperatorConfig("replace", {"new_value": "[ORGANIZATION]"}),
        }
    )
    
    # Step 6: Post-process redacted text to merge adjacent [LOCATION] tags and clean up
    redacted_text = anonymized_result.text
    
    # Replace multiple adjacent [LOCATION] tags with single [LOCATION]
    redacted_text = re.sub(r'(\[LOCATION\]\s*,?\s*)+', '[LOCATION] ', redacted_text)
    redacted_text = re.sub(r'\[LOCATION\]\s+\[LOCATION\]', '[LOCATION]', redacted_text)
    
    # Clean up any stray numbers after [LOCATION] that might be zip codes
    redacted_text = re.sub(r'\[LOCATION\]\s*,?\s*\d{4,6}\b', '[LOCATION]', redacted_text)
    
    # Clean up extra spaces
    redacted_text = re.sub(r'\s+', ' ', redacted_text).strip()
    
    return {
        "entities": entities,
        "redacted_text": redacted_text
    }


def calculate_privacy_score(entities: List[Dict]) -> int:
    """
    Calculate privacy score based on detected entities
    
    Score = sum of (entity weight * confidence)
    Capped at 100
    
    Args:
        entities: List of detected entities with types and scores
    
    Returns:
        Privacy score (0-100)
    """
    if not entities or len(entities) == 0:
        return 0
    
    total_score = 0
    
    for entity in entities:
        entity_type = entity.get("entity_type", "")
        confidence = entity.get("score", 0.8)
        
        # Get weight for this entity type (default to 10)
        weight = ENTITY_WEIGHTS.get(entity_type, 10)
        
        # Add weighted score
        total_score += weight * confidence
    
    # Cap at 100
    return min(int(total_score), 100)


def get_supported_entities() -> List[str]:
    """
    Get list of all supported entity types
    
    Returns:
        List of entity type names
    """
    return list(ENTITY_WEIGHTS.keys())
