import { message } from 'antd';

/**
 * 特性模块通用工具函数
 */

/**
 * 处理 API 响应错误
 * @param error - 错误对象
 * @param defaultMessage - 默认错误消息
 */
export const handleApiError = (error: unknown, defaultMessage = '操作失败，请稍后重试'): void => {
  if (error instanceof Error) {
    message.error(error.message || defaultMessage);
  } else {
    message.error(defaultMessage);
  }
};

/**
 * 处理成功响应
 * @param messageText - 成功消息文本
 * @param duration - 消息显示时长（秒）
 */
export const handleApiSuccess = (messageText: string, duration = 2): void => {
  message.success(messageText, duration);
};

/**
 * 格式化分页参数
 * @param params - 原始分页参数
 * @returns 格式化后的分页参数
 */
export const formatPaginationParams = <T extends { page?: number; size?: number }>(params: T): T => {
  return {
    ...params,
    page: params.page || 1,
    size: Math.min(params.size || 10, 100) // 限制最大页数为100
  };
};

/**
 * 检查是否为有效的 ID
 * @param id - 要检查的 ID
 * @returns 是否为有效 ID
 */
export const isValidId = (id: unknown): boolean => {
  return typeof id === 'number' && id > 0;
};

/**
 * 安全的字符串比较（忽略前后空格和大小写）
 * @param str1 - 字符串1
 * @param str2 - 字符串2
 * @returns 是否相等
 */
export const safeStringEquals = (str1?: string, str2?: string): boolean => {
  if (str1 === undefined || str2 === undefined) {
    return false;
  }
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

/**
 * 获取文件大小 human readable 格式
 * @param bytes - 字节数
 * @returns human readable 格式的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 延迟执行
 * @param ms - 延迟毫秒数
 * @returns Promise
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 深度克隆对象
 * @param obj - 要克隆的对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 判断是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳（毫秒）
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 格式化日期时间
 * @param date - 日期对象或时间戳
 * @param format - 格式字符串
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = date instanceof Date ? date : new Date(date);

  const replacements: Record<string, string> = {
    'YYYY': d.getFullYear().toString(),
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'DD': d.getDate().toString().padStart(2, '0'),
    'HH': d.getHours().toString().padStart(2, '0'),
    'mm': d.getMinutes().toString().padStart(2, '0'),
    'ss': d.getSeconds().toString().padStart(2, '0'),
    'SSS': d.getMilliseconds().toString().padStart(3, '0')
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, match => replacements[match]);
};