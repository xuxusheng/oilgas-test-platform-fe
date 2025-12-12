/**
 * API 响应接口泛型类型
 * @template T - 响应数据的类型
 *
 * 统一响应格式说明：
 * - code: 200表示成功，非200表示错误
 * - message: 响应消息描述
 * - data: 响应数据，根据具体接口返回不同类型
 * - errors: 字段级别的错误详情，用于表单验证等场景
 */
export interface ApiResponse<T> {
  code: number;        // 响应状态码，200表示成功，非200表示错误
  message: string;     // 响应消息描述
  data: T;             // 响应数据，根据接口不同返回不同类型
  errors: Record<string, any>; // 字段级别的错误详情
}
