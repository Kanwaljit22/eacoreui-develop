export interface Message {
  type: MessageType;
  text: string;
  code?: string;
}

export enum MessageType {
  Success = 'SUCCESS ',
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING',
  Warn = 'WARN'
}
