import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState, type SyntheticEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import AnalyticsPlaceholderChart from './AnalyticsPlaceholderChart';
import ResponseGraphFilters from './ResponseGraphFilters';
import { buildResponseFilterSummaryLines } from './responseGraphFilterSummary';
import {
  createInitialResponseGraphFilter,
  type ResponseGraphFilterValue,
} from './responseGraphFilterTypes';
import {
  ANALYTICS_GRAPH_META,
  type AnalyticsGraphId,
  type DataDomainTab,
  useAnalyticsGraphWorkspace,
} from './useAnalyticsGraphWorkspace';

const DOMAIN_PARAM = 'domain';

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

function createDefaultDateRange(): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return { start, end };
}

function isResponseAnalyticsGraph(graphId: AnalyticsGraphId | null): boolean {
  return graphId === 'responses-throughput' || graphId === 'responses-distribution';
}

export default function LocalLeaderAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const domainParam = searchParams.get(DOMAIN_PARAM);
  const dataTab: DataDomainTab = domainParam === 'responses' ? 'responses' : 'users';

  const setDataTab = useCallback(
    (_: SyntheticEvent, value: string) => {
      const nextDomain: DataDomainTab = value === 'responses' ? 'responses' : 'users';
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.set(DOMAIN_PARAM, nextDomain);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const [{ start: defaultStart, end: defaultEnd }] = useState(createDefaultDateRange);
  const [rangeStartInput, setRangeStartInput] = useState(() => formatDateForInput(defaultStart));
  const [rangeEndInput, setRangeEndInput] = useState(() => formatDateForInput(defaultEnd));

  const dateRangeLabel = useMemo(() => {
    const start = parseDateInput(rangeStartInput);
    const end = parseDateInput(rangeEndInput);
    if (!start || !end) {
      return 'Invalid range';
    }
    return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  }, [rangeStartInput, rangeEndInput]);

  const {
    graphIds,
    activeGraphId,
    carouselSlots,
    sendActiveToCarousel,
    restoreGraphToPlayground,
    focusGraphFromMetrics,
    removeCarouselSlot,
  } = useAnalyticsGraphWorkspace(dataTab);

  const { rubrics: rubricsFromHook, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const rubrics = rubricsFromHook ?? [];
  const [responseGraphFilter, setResponseGraphFilter] = useState<ResponseGraphFilterValue>(
    createInitialResponseGraphFilter
  );

  const responseChartFilterLines = useMemo(
    () => buildResponseFilterSummaryLines(rubrics, responseGraphFilter),
    [rubrics, responseGraphFilter]
  );

  const snapshotForActiveResponseChart = useCallback((): ResponseGraphFilterValue | null => {
    if (!activeGraphId || !isResponseAnalyticsGraph(activeGraphId)) {
      return null;
    }
    return { ...responseGraphFilter };
  }, [activeGraphId, responseGraphFilter]);

  const handleMinimizeToCarousel = useCallback(() => {
    sendActiveToCarousel(snapshotForActiveResponseChart());
  }, [sendActiveToCarousel, snapshotForActiveResponseChart]);

  const handleRestoreFromCarousel = useCallback(
    (instanceId: string) => {
      const outgoingSnapshot = snapshotForActiveResponseChart();
      const promoted = restoreGraphToPlayground(instanceId, outgoingSnapshot);
      if (promoted?.responseFilterSnapshot) {
        setResponseGraphFilter({ ...promoted.responseFilterSnapshot });
        return;
      }
      if (promoted && isResponseAnalyticsGraph(promoted.graphId)) {
        setResponseGraphFilter(createInitialResponseGraphFilter());
      }
    },
    [restoreGraphToPlayground, snapshotForActiveResponseChart]
  );

  const handleFocusMetric = useCallback(
    (graphId: AnalyticsGraphId) => {
      focusGraphFromMetrics(graphId, snapshotForActiveResponseChart());
    },
    [focusGraphFromMetrics, snapshotForActiveResponseChart]
  );

  return (
    <LocalLeaderAuthGuard>
      <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 'none', alignSelf: 'stretch' }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore users and responses for your institution. Metrics on the left will drive charts
            in the playground; minimized charts stay in the carousel below.
          </Typography>
        </Stack>

        <Tabs value={dataTab} onChange={setDataTab} aria-label="Analytics data domain">
          <Tab label="Users" value="users" />
          <Tab label="Responses" value="responses" />
        </Tabs>

        {dataTab === 'responses' && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <ResponseGraphFilters
              rubrics={rubrics}
              isLoadingRubrics={isLoadingRubrics}
              hasRubricsError={hasRubricsError}
              value={responseGraphFilter}
              onChange={setResponseGraphFilter}
            />
          </Paper>
        )}

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ flexShrink: 0 }}>
              Date range
            </Typography>
            <TextField
              label="Start"
              type="date"
              size="small"
              value={rangeStartInput}
              onChange={(event) => setRangeStartInput(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              label="End"
              type="date"
              size="small"
              value={rangeEndInput}
              onChange={(event) => setRangeEndInput(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 160 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: { sm: 'auto' } }}>
              Filter will apply when metrics are connected ({dateRangeLabel}).
            </Typography>
          </Stack>
        </Paper>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          alignItems="stretch"
          sx={{ width: '100%', minWidth: 0 }}
        >
          <Paper
            variant="outlined"
            sx={{
              width: { xs: '100%', lg: 280 },
              flexShrink: 0,
              p: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Metrics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Definitions and filters will appear here. Choose a chart preview to load the
              playground.
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <List dense disablePadding aria-label="Chart previews for current tab">
              {graphIds.map((graphId) => (
                <ListItemButton
                  key={graphId}
                  selected={activeGraphId === graphId}
                  onClick={() => handleFocusMetric(graphId)}
                >
                  <ListItemText
                    primary={ANALYTICS_GRAPH_META[graphId].title}
                    secondary={ANALYTICS_GRAPH_META[graphId].description}
                    secondaryTypographyProps={{ sx: { whiteSpace: 'normal' } }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              variant="outlined"
              sx={{
                padding: 1,
                flex: 1,
                minHeight: 420,
                minWidth: 0,
                width: '100%',
                overflowX: 'auto',
                bgcolor: 'background.paper',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Chart playground
                  </Typography>
                  <ViewCarouselOutlinedIcon fontSize="small" color="action" aria-hidden />
                </Stack>
                <Tooltip title="Save this chart to the carousel. You can store multiple charts of the same type (e.g. one per scale).">
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<NorthWestIcon />}
                      onClick={handleMinimizeToCarousel}
                      disabled={!activeGraphId}
                    >
                      Minimize to carousel
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              {activeGraphId ? (
                <AnalyticsPlaceholderChart
                  graphId={activeGraphId}
                  variant="playground"
                  filterLines={
                    isResponseAnalyticsGraph(activeGraphId) ? responseChartFilterLines : undefined
                  }
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 280,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    border: '1px dashed',
                    borderColor: 'divider',
                    px: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" align="center">
                    No chart in the playground. Select a metric on the left, or expand a chart from
                    the carousel below.
                  </Typography>
                </Box>
              )}
            </Paper>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Carousel
              </Typography>
              {carouselSlots.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Minimized charts appear here. You can keep several copies of the same graph (for
                  example, score distributions for different scales). Click a card to open it in the
                  playground, or remove it with the trash control.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, pt: 0.5 }}>
                  {carouselSlots.map((slot) => {
                    const graphTitle = ANALYTICS_GRAPH_META[slot.graphId].title;
                    const shortId = slot.instanceId.slice(0, 8);
                    const carouselFilterLines = slot.responseFilterSnapshot
                      ? buildResponseFilterSummaryLines(rubrics, slot.responseFilterSnapshot)
                      : undefined;
                    return (
                      <Paper
                        key={slot.instanceId}
                        variant="outlined"
                        sx={{
                          width: 260,
                          flexShrink: 0,
                          p: 1.25,
                          cursor: 'pointer',
                          transition: (theme) =>
                            theme.transitions.create(['box-shadow', 'border-color'], {
                              duration: theme.transitions.duration.short,
                            }),
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: 1,
                          },
                        }}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleRestoreFromCarousel(slot.instanceId)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleRestoreFromCarousel(slot.instanceId);
                          }
                        }}
                        aria-label={`Open ${graphTitle} (${shortId}) in playground`}
                      >
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Stack
                            direction="row"
                            alignItems="baseline"
                            spacing={0.5}
                            sx={{ minWidth: 0 }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                              noWrap
                            >
                              {graphTitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{ flexShrink: 0 }}
                            >
                              · {shortId}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0}>
                            <Tooltip title="Open in playground">
                              <IconButton
                                size="small"
                                aria-label={`Expand ${graphTitle}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleRestoreFromCarousel(slot.instanceId);
                                }}
                              >
                                <NorthWestIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove from carousel">
                              <IconButton
                                size="small"
                                aria-label={`Remove ${graphTitle} (${shortId}) from carousel`}
                                color="error"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeCarouselSlot(slot.instanceId);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                        <AnalyticsPlaceholderChart
                          graphId={slot.graphId}
                          variant="carousel"
                          filterLines={carouselFilterLines}
                        />
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </LocalLeaderAuthGuard>
  );
}
