import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { router } from './router'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

dayjs.locale('zh-cn')

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <QueryClientProvider client={queryClient}>
          <App>
            <RouterProvider router={router} />
          </App>
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
