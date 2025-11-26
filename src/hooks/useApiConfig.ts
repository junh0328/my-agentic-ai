'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApiConfig, AIProvider } from '@/components/settings';

interface ServerConfig {
  hasServerConfig: boolean;
  availableProviders: {
    gemini: boolean;
    claude: boolean;
  };
  defaultProvider: string;
}

interface UseApiConfigReturn {
  /** 서버 설정 정보 */
  serverConfig: ServerConfig | null;
  /** 클라이언트에서 설정한 API 설정 */
  clientConfig: ApiConfig | null;
  /** API 키 사용 가능 여부 (서버 또는 클라이언트) */
  isConfigured: boolean;
  /** 서버 설정 로딩 중 */
  isLoading: boolean;
  /** 클라이언트 설정 변경 핸들러 */
  setClientConfig: (config: ApiConfig | null) => void;
  /** API 요청 시 사용할 헤더 반환 */
  getRequestHeaders: () => Record<string, string>;
}

export function useApiConfig(): UseApiConfigReturn {
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(null);
  const [clientConfig, setClientConfig] = useState<ApiConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 서버 설정 확인
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data: ServerConfig) => {
        setServerConfig(data);
      })
      .catch(() => {
        setServerConfig({
          hasServerConfig: false,
          availableProviders: { gemini: false, claude: false },
          defaultProvider: 'gemini',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 세션 스토리지에서 클라이언트 설정 복원
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('ai-config');
    if (savedConfig) {
      try {
        const config: ApiConfig = JSON.parse(savedConfig);
        setClientConfig(config);
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  const handleSetClientConfig = useCallback((config: ApiConfig | null) => {
    setClientConfig(config);
    if (config) {
      sessionStorage.setItem('ai-config', JSON.stringify(config));
    } else {
      sessionStorage.removeItem('ai-config');
    }
  }, []);

  // API 요청 시 사용할 헤더 생성
  const getRequestHeaders = useCallback((): Record<string, string> => {
    if (!clientConfig) {
      return {};
    }

    return {
      'X-AI-Provider': clientConfig.provider,
      'X-AI-Key': clientConfig.apiKey,
      'X-AI-Model': clientConfig.model,
    };
  }, [clientConfig]);

  const isConfigured = serverConfig?.hasServerConfig || !!clientConfig;

  return {
    serverConfig,
    clientConfig,
    isConfigured,
    isLoading,
    setClientConfig: handleSetClientConfig,
    getRequestHeaders,
  };
}
