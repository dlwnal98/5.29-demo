import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Method } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BasicInfoTabProps {
  selectedMethod: Method;
  handleCopyEndpoint: () => void;
}

export function BasicInfoTab({ selectedMethod, handleCopyEndpoint }: BasicInfoTabProps) {
  const info = selectedMethod?.info as any;

  const integrationTypeLabel = getIntegrationTypeLabel(info?.['x-integration-type']);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] gap-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Method ID</div>
            <div className="text-sm font-medium">{info?.['x-method-id'] || '-'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Method Summary</div>
            <div className="text-sm font-medium">{info?.summary || '-'}</div>

            <div className="text-sm text-gray-600 dark:text-gray-400">Method Description</div>
            <div className="text-sm">{info?.description || '-'}</div>

          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] gap-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Integration Type</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {info?.['x-integration-type'] || 'HTTP'}
              </Badge>
              <span className="text-sm text-gray-500">{integrationTypeLabel}</span>
            </div>

            {info?.['x-integration-type'] === 'HTTP' && (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">URL</div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-sm text-gray-400"> <code className="text-sm font-mono">
                    {info?.['x-route-endpoint'] ?? ''}
                    {selectedMethod.resourcePath}
                  </code>
                    <Button className="h-2 w-3" variant="ghost" onClick={handleCopyEndpoint}>
                      <Copy className="h-2 w-3" />
                    </Button></span>
                </div>
              </>
            )}

            {info?.['x-integration-type'] === 'MOCK' && (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mock Response</div>
                <div className="text-sm text-gray-500">Mock integration is configured.</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getIntegrationTypeLabel(type: string): string {
  switch (type) {
    case 'HTTP':
      return 'HTTP proxy integration';
    case 'MOCK':
      return 'Mock integration';
    case 'AWS':
      return 'AWS service integration';
    case 'AWS_PROXY':
      return 'AWS Lambda proxy integration';
    default:
      return '';
  }
}
