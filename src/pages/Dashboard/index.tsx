import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import CountUp from 'react-countup'
import ReactECharts from 'echarts-for-react'
import { PageContainer } from '@ant-design/pro-components'
import { makeBreadcrumb } from '../../utils/breadcrumb'

const Dashboard: React.FC = () => {
  // Fix for "Element type is invalid" error with react-countup in some Vite environments
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CountUpComponent = (CountUp as any).default || CountUp
  const formatter = (value: number | string) => (
    <CountUpComponent end={Number(value)} separator="," />
  )

  const getOption = () => {
    return {
      title: {
        text: 'Weekly Traffic',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
      ],
    }
  }

  return (
    <PageContainer breadcrumb={makeBreadcrumb([{ href: '/dashboard', title: '仪表盘' }])}>
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Active Users" value={112893} formatter={formatter} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Account Balance (CNY)"
              value={112893}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="New Users" value={93} formatter={formatter} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Orders" value={1128} formatter={formatter} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <ReactECharts option={getOption()} style={{ height: 400 }} />
      </Card>
    </PageContainer>
  )
}

export default Dashboard
