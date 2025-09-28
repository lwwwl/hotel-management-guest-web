import type { TranslateRequest, TranslateResponse } from '../types';

const BASE_URL = 'http://111.223.37.162:7788'; // Assuming the same base URL

const headers = {
  'Content-Type': 'application/json',
  'X-Guest-Id': '5' // Assuming the same guest ID for now
};

export const translateAPI = {
  async getTranslateResult(request: TranslateRequest): Promise<TranslateResponse> {
    const response = await fetch(`${BASE_URL}/translate/get-translate-result`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to get translation: ${response.status} ${errorData.message || ''}`);
    }

    return response.json();
  }
};
