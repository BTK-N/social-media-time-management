import { ChatMessagePayload, ChatReply, DiagnosisPayload, DiagnosisResult } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiClient {
  static async predictAndConsult(payload: DiagnosisPayload): Promise<DiagnosisResult> {
    const res = await fetch(`${API_BASE}/predict_and_consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  }

  static async chat(payload: ChatMessagePayload): Promise<ChatReply> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  }
}
