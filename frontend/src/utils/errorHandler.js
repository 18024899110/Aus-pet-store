// 错误处理工具
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

// 网络错误处理
export const handleNetworkError = (error) => {
  if (!error.response) {
    // 网络连接错误
    return new AppError('网络连接失败，请检查您的网络连接', 'NETWORK_ERROR', 0);
  }
  
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return new AppError(data?.detail || '请求参数错误', 'BAD_REQUEST', 400);
    case 401:
      return new AppError('登录已过期，请重新登录', 'UNAUTHORIZED', 401);
    case 403:
      return new AppError('您没有权限执行此操作', 'FORBIDDEN', 403);
    case 404:
      return new AppError('请求的资源不存在', 'NOT_FOUND', 404);
    case 422:
      return new AppError(data?.detail || '输入数据格式错误', 'VALIDATION_ERROR', 422);
    case 429:
      return new AppError('请求过于频繁，请稍后再试', 'RATE_LIMIT', 429);
    case 500:
      return new AppError('服务器内部错误，请稍后再试', 'INTERNAL_ERROR', 500);
    case 502:
    case 503:
    case 504:
      return new AppError('服务暂时不可用，请稍后再试', 'SERVICE_UNAVAILABLE', status);
    default:
      return new AppError(
        data?.detail || data?.message || `请求失败 (${status})`, 
        'HTTP_ERROR', 
        status
      );
  }
};

// 表单验证错误处理
export const handleValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map(error => error.msg || error.message).join(', ');
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors).flat().join(', ');
  }
  
  return errors?.toString() || '表单验证失败';
};

// 日志记录
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Stack:', error.stack);
    console.groupEnd();
  }
  
  // 在生产环境中，这里可以发送错误到监控服务
  // 例如：Sentry, LogRocket 等
};

// 用户友好的错误消息
export const getUserFriendlyMessage = (error) => {
  const errorMessages = {
    NETWORK_ERROR: '网络连接失败，请检查您的网络设置',
    UNAUTHORIZED: '登录已过期，请重新登录',
    FORBIDDEN: '您没有权限执行此操作',
    NOT_FOUND: '请求的内容不存在',
    VALIDATION_ERROR: '请检查输入的信息是否正确',
    RATE_LIMIT: '操作过于频繁，请稍后再试',
    INTERNAL_ERROR: '系统繁忙，请稍后再试',
    SERVICE_UNAVAILABLE: '服务暂时不可用，请稍后再试',
  };
  
  if (error instanceof AppError) {
    return errorMessages[error.code] || error.message;
  }
  
  return error?.message || '操作失败，请稍后再试';
};