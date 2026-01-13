import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { useTasksContext } from '@/context/TasksContext';
import type { Metrics } from '@/types';

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  const content = (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  );

  return hint ? (
    <Tooltip title={hint}>
      <Box component="span">{content}</Box>
    </Tooltip>
  ) : (
    content
  );
}

export default function MetricsBar({
  metricsOverride,
}: {
  metricsOverride?: Metrics;
}) {
  const { metrics } = useTasksContext();
  const m = metricsOverride ?? metrics;

  if (!m) return null;

  const {
    totalRevenue,
    timeEfficiencyPct,
    revenuePerHour,
    averageROI,
    performanceGrade,
    totalTimeTaken,
  } = m;

  const safeRevenuePerHour =
    Number.isFinite(revenuePerHour) ? revenuePerHour : 0;

  const safeTime =
    Number.isFinite(totalTimeTaken) ? totalTimeTaken : 0;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(5, 1fr)',
            },
          }}
        >
          <Stat
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            hint="Sum of revenue for Done tasks"
          />
          <Stat
            label="Time Efficiency"
            value={`${timeEfficiencyPct.toFixed(0)}%`}
            hint="(Done / All) × 100"
          />
          <Stat
            label="Revenue / Hour"
            value={`$${safeRevenuePerHour.toFixed(1)}`}
            hint="Total revenue divided by total time"
          />
          <Stat
            label="Average ROI"
            value={averageROI.toFixed(1)}
            hint="Mean of valid ROI values"
          />
          <Stat
            label="Grade"
            value={performanceGrade}
            hint={`Based on Avg ROI (${averageROI.toFixed(
              1
            )}) • Total time ${safeTime}h`}
          />
        </Box>
      </CardContent>
    </Card>
  );
}


