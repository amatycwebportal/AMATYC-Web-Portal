import type { SxProps, Theme } from '@mui/material/styles';

/** Applied to the export root only while a PNG is being generated. */
export const CHART_EXPORT_LIGHT_CLASS = 'chart-export-light';

const LIGHT_TEXT_PRIMARY = 'rgba(0, 0, 0, 0.87)';
const LIGHT_TEXT_SECONDARY = 'rgba(0, 0, 0, 0.6)';
const LIGHT_DIVIDER = 'rgba(0, 0, 0, 0.12)';
const LIGHT_SURFACE = '#ffffff';

export const chartExportLightSurfaceSx: SxProps<Theme> = {
  [`&.${CHART_EXPORT_LIGHT_CLASS}`]: {
    bgcolor: LIGHT_SURFACE,
    color: LIGHT_TEXT_PRIMARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} .MuiPaper-root`]: {
    bgcolor: LIGHT_SURFACE,
    color: LIGHT_TEXT_PRIMARY,
    borderColor: LIGHT_DIVIDER,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} .MuiTypography-root`]: {
    color: LIGHT_TEXT_PRIMARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} .MuiTypography-colorTextSecondary`]: {
    color: LIGHT_TEXT_SECONDARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} .MuiTableCell-root`]: {
    color: LIGHT_TEXT_PRIMARY,
    borderColor: LIGHT_DIVIDER,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} .MuiTableCell-head`]: {
    color: LIGHT_TEXT_SECONDARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} svg .MuiChartsAxis-tickLabel`]: {
    fill: LIGHT_TEXT_SECONDARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} svg .MuiChartsAxis-label`]: {
    fill: LIGHT_TEXT_SECONDARY,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} svg .MuiChartsAxis-line`]: {
    stroke: LIGHT_DIVIDER,
  },
  [`&.${CHART_EXPORT_LIGHT_CLASS} svg .MuiChartsGrid-line`]: {
    stroke: LIGHT_DIVIDER,
  },
};
