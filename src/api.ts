import {
  FailedMappingResult,
  MappingResultStatus,
  SuccessfulMappingResult,
} from './stores/types';

export interface MappingRequestBody {
  rml: string;
  sources: Record<string, string>;
  asQuads: boolean;
}

export const connectionErrorMsg = '无法连接到服务器';

type MappingResultResponseType = Promise<
  FailedMappingResult | SuccessfulMappingResult
>;

export async function getMappingResult(
  data: MappingRequestBody
): MappingResultResponseType {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    switch (response.status) {
      case 200:
        return {
          status: MappingResultStatus.successful,
          result: (await response.json()).output,
        };
      case 400:
        return {
          status: MappingResultStatus.executionFailed,
          message: await response.text(),
        };
      default:
        return {
          status: MappingResultStatus.connectionFailed,
          message: connectionErrorMsg,
        };
    }
  } catch (error) {
    return {
      status: MappingResultStatus.connectionFailed,
      message: connectionErrorMsg,
    };
  }
}
