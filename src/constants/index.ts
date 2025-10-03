import type { QuickService, LanguageTexts, SupportedLanguage } from '../types';

export const API_BASE_URL = 'https://kefu.5ok.co/api/v1/guest';
// export const API_BASE_URL = 'http://localhost:7788';

export const MOCK_MESSAGES = [
  { id: 1, sender: 'agent' as const, text: '您好！有什么可以帮助您的吗？', time: '10:00' },
  { id: 2, sender: 'guest' as const, text: '我需要额外的毛巾', time: '10:01' }
];

export const MOCK = {
  roomNumber: '1208',
  validCodes: ['张三', '1234', '李四', '5678']
};

export const LANGUAGES: Record<string, LanguageTexts> = {
  zh: {
    welcome: '欢迎入住',
    roomNumber: '房间号: ',
    verifyLabel: '请输入您的姓氏后2位或手机号后4位',
    verifyPlaceholder: '例如：张三 或 1234',
    verifyButton: '确认验证',
    verifying: '验证中...',
    quickServices: '快捷服务',
    serviceNote: '选择服务后将直接联系酒店工作人员',
    helpText: '需要帮助？请联系前台 ',
    serviceRequest: '服务请求',
    additionalNotes: '备注说明',
    serviceNotePlaceholder: '请输入具体需求或特殊要求...',
    serviceInfo: '您的服务请求将立即发送给酒店工作人员，我们会尽快为您安排。',
    cancel: '取消',
    confirm: '确认',
    verifyFailed: '验证失败，请检查输入信息是否正确',
    networkError: '网络错误，请稍后重试',
    verifySuccess: '验证成功！即将跳转到聊天页面',
    serviceConfirmed: '服务请求已提交，工作人员会尽快联系您',
    // --- Merged from constants.ts for VerifyPage ---
    welcome_Verify: '欢迎光临',
    verifyButton_Verify: '进入咨询',
    verifyFailed_Verify: '验证失败，请检查您的姓名和手机号。',
    networkError_Verify: '网络错误，请稍后重-试。',
    guestNameLabel: '您的姓名',
    guestNamePlaceholder: '请输入您的姓名',
    phoneSuffixLabel: '手机号后四位',
    phoneSuffixPlaceholder: '请输入手机号后四位',
    verifyInvalidInput: '请输入姓名和手机号后四位',
    serviceNote_Verify: '部分服务可能需要人工确认',
    helpText_Verify: '需要帮助？请致电前台：',
    serviceRequestTitle: '服务请求',
    serviceRequestLabel: '备注 (可选)',
    serviceRequestPlaceholder: '例如：需要两双筷子',
    serviceConfirmed_Verify: '服务请求已发送',
    // ChatPage
    verified: '已验证',
    webSocketConnected: 'WebSocket已连接',
    webSocketDisconnected: 'WebSocket未连接',
    endChat: '结束对话',
    confirmEndChat: '确定要结束对话吗？',
    loadingMessages: '加载消息中...',
    loadingMore: '加载中...',
    pullToLoadMore: '上拉加载更多',
    noMessages: '暂无消息',
    // Components
    sending: '发送中...',
    typeMessage: '输入消息...',
    quickMenu: '快捷菜单',
    enableAutoTranslate: '开启自动翻译',
    disableAutoTranslate: '关闭自动翻译',
    // ExpiredPage
    sessionExpiredTitle: '会话已过期',
    sessionExpiredMessage: '您的会话已结束，如需继续使用服务，请重新扫码验证身份。',
  },
  en: {
    welcome: 'Welcome',
    roomNumber: 'Room: ',
    verifyLabel: 'Please enter the last 2 digits of your surname or last 4 digits of your phone',
    verifyPlaceholder: 'e.g., Smith or 1234',
    verifyButton: 'Verify',
    verifying: 'Verifying...',
    quickServices: 'Quick Services',
    serviceNote: 'Hotel staff will be contacted directly after selecting service',
    helpText: 'Need help? Please contact front desk ',
    serviceRequest: 'Service Request',
    additionalNotes: 'Additional Notes',
    serviceNotePlaceholder: 'Please enter specific requirements or special requests...',
    serviceInfo: 'Your service request will be sent to hotel staff immediately, and we will arrange it as soon as possible.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    verifyFailed: 'Verification failed, please check your input',
    networkError: 'Network error, please try again later',
    verifySuccess: 'Verification successful! Redirecting to chat page',
    serviceConfirmed: 'Service request submitted, staff will contact you soon',
    // --- Merged from constants.ts for VerifyPage ---
    welcome_Verify: 'Welcome',
    verifyButton_Verify: 'Enter Chat',
    verifyFailed_Verify: 'Verification failed. Please check your name and phone number.',
    networkError_Verify: 'Network error. Please try again later.',
    guestNameLabel: 'Your Name',
    guestNamePlaceholder: 'Enter your name',
    phoneSuffixLabel: 'Last 4 Digits of Phone',
    phoneSuffixPlaceholder: 'Enter last 4 digits of phone',
    verifyInvalidInput: 'Please enter both name and phone suffix',
    serviceNote_Verify: 'Some services may require manual confirmation.',
    helpText_Verify: 'Need help? Call the front desk:',
    serviceRequestTitle: 'Service Request',
    serviceRequestLabel: 'Notes (Optional)',
    serviceRequestPlaceholder: 'e.g., need two pairs of chopsticks',
    serviceConfirmed_Verify: 'Service request sent',
    // ChatPage
    verified: 'Verified',
    webSocketConnected: 'WebSocket connected',
    webSocketDisconnected: 'WebSocket disconnected',
    endChat: 'End Chat',
    confirmEndChat: 'Are you sure you want to end the chat?',
    loadingMessages: 'Loading messages...',
    loadingMore: 'Loading...',
    pullToLoadMore: 'Pull up to load more',
    noMessages: 'No messages yet',
    // Components
    sending: 'Sending...',
    typeMessage: 'Type a message...',
    quickMenu: 'Quick Menu',
    enableAutoTranslate: 'Enable auto-translation',
    disableAutoTranslate: 'Disable auto-translation',
    // ExpiredPage
    sessionExpiredTitle: 'Session Expired',
    sessionExpiredMessage: 'Your session has ended. To continue, please scan the QR code again to verify your identity.',
  },
  ja: {
    welcome: 'ようこそ',
    roomNumber: '部屋番号: ',
    verifyLabel: '姓の最後2文字または電話番号の最後4桁を入力してください',
    verifyPlaceholder: '例：田中 または 1234',
    verifyButton: '確認',
    verifying: '確認中...',
    quickServices: 'クイックサービス',
    serviceNote: 'サービス選択後、ホテルスタッフに直接連絡いたします',
    helpText: 'ヘルプが必要ですか？フロントデスクまでお電話ください ',
    serviceRequest: 'サービスリクエスト',
    additionalNotes: '備考',
    serviceNotePlaceholder: '具体的な要求や特別な要望を入力してください...',
    serviceInfo: 'サービスリクエストは即座にホテルスタッフに送信され、可能な限り迅速に手配いたします。',
    cancel: 'キャンセル',
    confirm: '確認',
    verifyFailed: '確認に失敗しました。入力情報を確認してください',
    networkError: 'ネットワークエラーです。後でもう一度お試しください',
    verifySuccess: '確認成功！チャットページにリダイレクトします',
    serviceConfirmed: 'サービスリクエストが送信されました。スタッフがすぐに連絡いたします',
    // --- Merged from constants.ts for VerifyPage ---
    welcome_Verify: 'ようこそ',
    verifyButton_Verify: 'チャットに入る',
    verifyFailed_Verify: '認証に失敗しました。名前と電話番号を確認してください。',
    networkError_Verify: 'ネットワークエラー。後でもう一度お試しください。',
    guestNameLabel: 'お名前',
    guestNamePlaceholder: 'お名前を入力してください',
    phoneSuffixLabel: '電話番号の下4桁',
    phoneSuffixPlaceholder: '電話番号の下4桁を入力してください',
    verifyInvalidInput: '名前と電話番号の両方を入力してください',
    serviceNote_Verify: '一部のサービスは手動での確認が必要です',
    helpText_Verify: 'お困りですか？フロントまでお電話ください：',
    serviceRequestTitle: 'サービスリクエスト',
    serviceRequestLabel: '備考（任意）',
    serviceRequestPlaceholder: '例：箸を二膳お願いします',
    serviceConfirmed_Verify: 'サービスリクエストが送信されました',
    // ChatPage
    verified: '確認済み',
    webSocketConnected: 'WebSocket接続済み',
    webSocketDisconnected: 'WebSocket未接続',
    endChat: 'チャット終了',
    confirmEndChat: 'チャットを終了してもよろしいですか？',
    loadingMessages: 'メッセージを読み込み中...',
    loadingMore: '読み込み中...',
    pullToLoadMore: 'プルアップしてさらに読み込む',
    noMessages: 'メッセージはまだありません',
    // Components
    sending: '送信中...',
    typeMessage: 'メッセージを入力...',
    quickMenu: 'クイックメニュー',
    enableAutoTranslate: '自動翻訳を有効にする',
    disableAutoTranslate: '自動翻訳を無効にする',
    // ExpiredPage
    sessionExpiredTitle: 'セッションが期限切れです',
    sessionExpiredMessage: 'セッションが終了しました。サービスを継続して利用するには、QRコードを再スキャンして本人確認を行ってください。',
  },
  ko: {
    welcome: '환영합니다',
    roomNumber: '객실 번호: ',
    verifyLabel: '성씨의 마지막 2자리 또는 전화번호의 마지막 4자리를 입력하세요',
    verifyPlaceholder: '예: 김민수 또는 1234',
    verifyButton: '확인',
    verifying: '확인 중...',
    quickServices: '빠른 서비스',
    serviceNote: '서비스 선택 후 호텔 직원에게 직접 연락드립니다',
    helpText: '도움이 필요하세요? 프론트 데스크로 연락하세요 ',
    serviceRequest: '서비스 요청',
    additionalNotes: '추가 사항',
    serviceNotePlaceholder: '구체적인 요구사항이나 특별한 요청사항을 입력하세요...',
    serviceInfo: '서비스 요청이 즉시 호텔 직원에게 전송되며, 가능한 한 빠르게 안내해드리겠습니다.',
    cancel: '취소',
    confirm: '확인',
    verifyFailed: '확인에 실패했습니다. 입력 정보를 확인하세요',
    networkError: '네트워크 오류입니다. 나중에 다시 시도하세요',
    verifySuccess: '확인 성공! 채팅 페이지로 이동합니다',
    serviceConfirmed: '서비스 요청이 제출되었습니다. 직원이 곧 연락드리겠습니다'
  }
};

export const getQuickServices = (language: string): QuickService[] => {
  const services = {
    zh: [
      { id: 1, name: '客房清洁', icon: 'uil uil-cleaning-services', description: '安排客房清洁服务' },
      { id: 2, name: '送餐服务', icon: 'uil uil-utensils', description: '客房送餐服务' },
      { id: 3, name: '洗衣服务', icon: 'uil uil-shirt', description: '衣物清洗服务' },
      { id: 4, name: '设施维修', icon: 'uil uil-wrench', description: '房间设施维修' },
      { id: 5, name: '额外用品', icon: 'uil uil-box', description: '毛巾、拖鞋等用品' },
      { id: 6, name: '其他服务', icon: 'uil uil-question-circle', description: '其他服务需求' }
    ],
    en: [
      { id: 1, name: 'Housekeeping', icon: 'uil uil-cleaning-services', description: 'Room cleaning service' },
      { id: 2, name: 'Room Service', icon: 'uil uil-utensils', description: 'Food delivery service' },
      { id: 3, name: 'Laundry', icon: 'uil uil-shirt', description: 'Laundry service' },
      { id: 4, name: 'Maintenance', icon: 'uil uil-wrench', description: 'Room facility repair' },
      { id: 5, name: 'Amenities', icon: 'uil uil-box', description: 'Towels, slippers, etc.' },
      { id: 6, name: 'Other Services', icon: 'uil uil-question-circle', description: 'Other service needs' }
    ],
    ja: [
      { id: 1, name: 'ハウスキーピング', icon: 'uil uil-cleaning-services', description: '客室清掃サービス' },
      { id: 2, name: 'ルームサービス', icon: 'uil uil-utensils', description: '客室内食事サービス' },
      { id: 3, name: 'ランドリー', icon: 'uil uil-shirt', description: '洗濯サービス' },
      { id: 4, name: 'メンテナンス', icon: 'uil uil-wrench', description: '客室設備修理' },
      { id: 5, name: 'アメニティ', icon: 'uil uil-box', description: 'タオル、スリッパなど' },
      { id: 6, name: 'その他サービス', icon: 'uil uil-question-circle', description: 'その他のサービス要求' }
    ],
    ko: [
      { id: 1, name: '하우스키핑', icon: 'uil uil-cleaning-services', description: '객실 청소 서비스' },
      { id: 2, name: '룸서비스', icon: 'uil uil-utensils', description: '객실 내 식사 서비스' },
      { id: 3, name: '세탁 서비스', icon: 'uil uil-shirt', description: '의류 세탁 서비스' },
      { id: 4, name: '시설 수리', icon: 'uil uil-wrench', description: '객실 시설 수리' },
      { id: 5, name: '어메니티', icon: 'uil uil-box', description: '수건, 슬리퍼 등' },
      { id: 6, name: '기타 서비스', icon: 'uil uil-question-circle', description: '기타 서비스 요청' }
    ]
  };
  return services[language as keyof typeof services] || services.zh;
}; 