'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AIProvider = 'gemini' | 'claude';

export interface ApiConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

interface ApiKeyModalProps {
  onConfigChange?: (config: ApiConfig | null) => void;
  hasServerConfig: boolean;
}

const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash',
  claude: 'claude-sonnet-4-20250514',
};

const MODEL_OPTIONS = {
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  ],
  claude: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
  ],
};

export function ApiKeyModal({ onConfigChange, hasServerConfig }: ApiKeyModalProps) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODELS.gemini);
  const [saved, setSaved] = useState(false);

  // 세션 스토리지에서 설정 복원
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('ai-config');
    if (savedConfig) {
      try {
        const config: ApiConfig = JSON.parse(savedConfig);
        setProvider(config.provider);
        setApiKey(config.apiKey);
        setModel(config.model);
        setSaved(true);
        onConfigChange?.(config);
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, [onConfigChange]);

  // Provider 변경 시 모델 초기화
  useEffect(() => {
    setModel(DEFAULT_MODELS[provider]);
  }, [provider]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      return;
    }

    const config: ApiConfig = {
      provider,
      apiKey: apiKey.trim(),
      model,
    };

    sessionStorage.setItem('ai-config', JSON.stringify(config));
    setSaved(true);
    onConfigChange?.(config);
    setOpen(false);
  };

  const handleClear = () => {
    sessionStorage.removeItem('ai-config');
    setApiKey('');
    setProvider('gemini');
    setModel(DEFAULT_MODELS.gemini);
    setSaved(false);
    onConfigChange?.(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50"
          title="API 설정"
        >
          <Settings className={`h-4 w-4 ${saved ? 'text-green-500' : ''}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API 설정</DialogTitle>
          <DialogDescription>
            {hasServerConfig
              ? '서버에 API 키가 설정되어 있습니다. 다른 키를 사용하려면 아래에서 설정하세요.'
              : '감정 분석을 사용하려면 API 키를 입력해주세요. 키는 브라우저 세션에만 저장되며, 탭을 닫으면 삭제됩니다.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Provider 선택 */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as AIProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Provider 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini (무료)</SelectItem>
                <SelectItem value="claude">Anthropic Claude (유료)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API 키 입력 */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={provider === 'gemini' ? 'AIza...' : 'sk-ant-...'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {provider === 'gemini' ? (
                <>
                  <a
                    href="https://ai.google.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Google AI Studio
                  </a>
                  에서 무료로 발급받을 수 있습니다.
                </>
              ) : (
                <>
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Anthropic Console
                  </a>
                  에서 발급받을 수 있습니다. (유료)
                </>
              )}
            </p>
          </div>

          {/* 모델 선택 */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="모델 선택" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS[provider].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          {saved && (
            <Button variant="outline" onClick={handleClear}>
              설정 초기화
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
