export interface Message {
  id: number;
  sender: 'guest' | 'agent';
  text: string;
  time: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  template: string;
}

export interface QuickService {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface LanguageTexts {
  welcome: string;
  roomNumber: string;
  verifyLabel: string;
  verifyPlaceholder: string;
  verifyButton: string;
  verifying: string;
  quickServices: string;
  serviceNote: string;
  helpText: string;
  serviceRequest: string;
  additionalNotes: string;
  serviceNotePlaceholder: string;
  serviceInfo: string;
  cancel: string;
  confirm: string;
  verifyFailed: string;
  networkError: string;
  verifySuccess: string;
  serviceConfirmed: string;
} 