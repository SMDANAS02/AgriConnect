/**
 * voiceService.js
 * Frontend service for Tamil Voice Assistant API calls
 */
import apiClient from './apiClient';

export const voiceService = {
  /**
   * Send transcribed Tamil text to the backend Q&A engine
   * @param {string} text   - Tamil farming query (transcribed or typed)
   * @param {string} context - 'advisory' | 'disease' | 'general'
   * @returns {Promise}     - Axios response with { answer, category }
   */
  async queryTamilAssistant(text, context = 'general') {
    return apiClient.post('/voice/query', { text, context });
  }
};
