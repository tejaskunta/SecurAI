/**
 * LocalStorage Database Layer
 * Client-side data persistence for privacy-first architecture
 * Zero server storage - all data stays in browser
 */

const STORAGE_KEYS = {
  HISTORY: 'securai_history',
  API_KEY: 'geminiApiKey', // Keep same key for compatibility
  USER_PREFS: 'securai_preferences',
  SESSION: 'securai_session'
};

/**
 * Save analysis result to history
 * @param {Object} analysisData - Analysis result from backend
 * @returns {boolean} Success status
 */
export const saveToHistory = (analysisData) => {
  try {
    const history = getHistory();
    
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      originalText: analysisData.original_text,
      redactedText: analysisData.redacted_text,
      entities: analysisData.entities || [],
      privacyScore: analysisData.privacy_score,
      geminiResponse: analysisData.gemini_response || null
    };
    
    // Add to beginning of array
    history.unshift(entry);
    
    // Keep only last 100 entries to avoid storage limits
    const limited = history.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    // Check if quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Clearing old entries...');
      // Keep only last 50 entries
      const history = getHistory().slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
    return false;
  }
};

/**
 * Get all history entries
 * @returns {Array} Array of analysis entries
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

/**
 * Get single history entry by ID
 * @param {number} id - Entry ID
 * @returns {Object|null} Entry or null if not found
 */
export const getHistoryEntry = (id) => {
  const history = getHistory();
  return history.find(entry => entry.id === id) || null;
};

/**
 * Delete single history entry
 * @param {number} id - Entry ID to delete
 * @returns {boolean} Success status
 */
export const deleteHistoryEntry = (id) => {
  try {
    const history = getHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting entry:', error);
    return false;
  }
};

/**
 * Clear all history
 * @returns {boolean} Success status
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

/**
 * Get history statistics
 * @returns {Object} Statistics
 */
export const getHistoryStats = () => {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      totalEntries: 0,
      avgPrivacyScore: 0,
      totalEntitiesDetected: 0,
      mostCommonEntity: null
    };
  }
  
  const totalScore = history.reduce((sum, entry) => sum + (entry.privacyScore || 0), 0);
  const allEntities = history.flatMap(entry => entry.entities || []);
  
  // Count entity types
  const entityCounts = {};
  allEntities.forEach(entity => {
    entityCounts[entity.entity_type] = (entityCounts[entity.entity_type] || 0) + 1;
  });
  
  const mostCommon = Object.keys(entityCounts).length > 0
    ? Object.keys(entityCounts).reduce((a, b) => entityCounts[a] > entityCounts[b] ? a : b)
    : null;
  
  return {
    totalEntries: history.length,
    avgPrivacyScore: totalScore / history.length,
    totalEntitiesDetected: allEntities.length,
    mostCommonEntity: mostCommon
  };
};

/**
 * Export history as JSON file
 * @returns {string} JSON string of history
 */
export const exportHistory = () => {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
};

/**
 * Import history from JSON
 * @param {string} jsonData - JSON string of history
 * @returns {boolean} Success status
 */
export const importHistory = (jsonData) => {
  try {
    const imported = JSON.parse(jsonData);
    if (!Array.isArray(imported)) {
      throw new Error('Invalid history format');
    }
    
    // Validate structure
    const valid = imported.every(entry => 
      entry.id && entry.timestamp && entry.originalText && entry.redactedText
    );
    
    if (!valid) {
      throw new Error('Invalid entry structure');
    }
    
    // Merge with existing history
    const existing = getHistory();
    const merged = [...imported, ...existing];
    
    // Remove duplicates by ID
    const unique = merged.filter((entry, index, self) =>
      index === self.findIndex((e) => e.id === entry.id)
    );
    
    // Sort by timestamp (newest first)
    unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Keep only last 100
    const limited = unique.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
};

/**
 * Save Gemini API key
 * @param {string} key - API key
 * @returns {boolean} Success status
 */
export const saveApiKey = (key) => {
  if (key && key.trim()) {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  }
  return false;
};

/**
 * Get stored API key
 * @returns {string} API key or empty string
 */
export const getApiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
};

/**
 * Remove API key
 * @returns {boolean} Success status
 */
export const clearApiKey = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing API key:', error);
    return false;
  }
};

/**
 * Check if API key is saved
 * @returns {boolean} True if key exists
 */
export const hasApiKey = () => {
  const key = getApiKey();
  return key && key.length > 0;
};

/**
 * Save user preferences
 * @param {Object} prefs - Preferences object
 * @returns {boolean} Success status
 */
export const savePreferences = (prefs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

/**
 * Get user preferences
 * @returns {Object} Preferences object
 */
export const getPreferences = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
    return data ? JSON.parse(data) : {
      theme: 'dark',
      autoSave: true,
      showWelcome: true
    };
  } catch (error) {
    console.error('Error reading preferences:', error);
    return { theme: 'dark', autoSave: true, showWelcome: true };
  }
};

/**
 * Check localStorage availability and quota
 * @returns {Object} Storage info
 */
export const getStorageInfo = () => {
  try {
    // Estimate storage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    
    // Convert to KB
    const usedKB = (totalSize / 1024).toFixed(2);
    
    // Typical localStorage limit is 5-10MB
    const estimatedLimitKB = 5 * 1024; // 5MB
    const percentUsed = ((totalSize / (estimatedLimitKB * 1024)) * 100).toFixed(1);
    
    return {
      available: true,
      usedKB: parseFloat(usedKB),
      percentUsed: parseFloat(percentUsed),
      historyEntries: getHistory().length
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
};

/**
 * Clear all app data (nuclear option)
 * @returns {boolean} Success status
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export default {
  saveToHistory,
  getHistory,
  getHistoryEntry,
  deleteHistoryEntry,
  clearHistory,
  getHistoryStats,
  exportHistory,
  importHistory,
  saveApiKey,
  getApiKey,
  clearApiKey,
  hasApiKey,
  savePreferences,
  getPreferences,
  getStorageInfo,
  clearAllData
};
