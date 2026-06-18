import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface SupabaseRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabaseConfig = environment.supabase;

  async request(path: string, options: SupabaseRequestOptions = {}): Promise<Response> {
    const endpoint = `${this.supabaseConfig.url}/rest/v1/${path}`;
    const method = options.method ?? 'GET';
    const hasBody = options.body !== undefined;

    const response = await fetch(endpoint, {
      method,
      headers: {
        apikey: this.supabaseConfig.publishableKey,
        Authorization: `Bearer ${this.supabaseConfig.publishableKey}`,
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers ?? {})
      },
      body: hasBody
        ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
        : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase request failed (${response.status}): ${errorText}`);
    }

    return response;
  }
}
