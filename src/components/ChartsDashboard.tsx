import { Box, Card, CardContent, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import type { DerivedTask } from '@/types';

interface Props {
  tasks: DerivedTask[];
}

const PRIORITIES = ['High', 'Medium', 'Low'] as const;
const STATUSES = ['Todo', 'In Progress', 'Done'] as const;

export default function ChartsDashboard({ tasks }: Props) {
  // ✅ Revenue by Priority
  const revenueByPriority = PRIORITIES.map(priority => ({
    priority,
    revenue: tasks
      .filter(t => t.priority === priority)
      .reduce((sum, t) => sum + (t.revenue ?? 0), 0),
  }));

  // ✅ Revenue by Status
  const revenueByStatus = STATUSES.map(status => ({
    status,
    revenue: tasks
      .filter(t => t.status === status)
      .reduce((sum, t) => sum + (t.revenue ?? 0), 0),
  }));

  // ✅ Correct ROI bucketing (handles null / undefined / NaN)
  const roiBuckets = [
    {
      label: '<200',
      count: tasks.filter(t => typeof t.roi === 'number' && t.roi < 200).length,
    },
    {
      label: '200–500',
      count: tasks.filter(
        t => typeof t.roi === 'number' && t.roi >= 200 && t.roi <= 500
      ).length,
    },
    {
      label: '>500',
      count: tasks.filter(t => typeof t.roi === 'number' && t.roi > 500).length,
    },
    {
      label: 'N/A',
      count: tasks.filter(t => t.roi == null || Number.isNaN(t.roi)).length,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Insights
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
          }}
        >
          {/* Revenue by Priority */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Revenue by Priority
            </Typography>
            <BarChart
              height={240}
              xAxis={[
                { scaleType: 'band', data: revenueByPriority.map(d => d.priority) },
              ]}
              series={[
                {
                  data: revenueByPriority.map(d => d.revenue),
                },
              ]}
            />
          </Box>

          {/* Revenue by Status */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Revenue by Status
            </Typography>
            <PieChart
              height={240}
              series={[
                {
                  data: revenueByStatus.map(d => ({
                    id: d.status,
                    label: d.status,
                    value: d.revenue,
                  })),
                },
              ]}
            />
          </Box>

          {/* ROI Distribution */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              ROI Distribution
            </Typography>
            <BarChart
              height={240}
              xAxis={[
                { scaleType: 'band', data: roiBuckets.map(b => b.label) },
              ]}
              series={[
                {
                  data: roiBuckets.map(b => b.count),
                },
              ]}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}


