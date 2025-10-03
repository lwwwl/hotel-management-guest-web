import type { TranslateRequest, TranslateResponse } from '../types';
import api from '../services/api';

export const translateAPI = {
  async getTranslateResult(request: TranslateRequest): Promise<TranslateResponse> {
    const response = await api.post<TranslateResponse>('/chat-guest/translate/get-translate-result', request);
    return response.data;
  }
};
