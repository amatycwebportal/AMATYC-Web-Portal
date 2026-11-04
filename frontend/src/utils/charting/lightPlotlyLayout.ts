import type { Layout } from 'plotly.js';

const LIGHT_TEXT_PRIMARY = 'rgba(0, 0, 0, 0.87)';
const LIGHT_TEXT_SECONDARY = 'rgba(0, 0, 0, 0.6)';
const LIGHT_GRID = 'rgba(0, 0, 0, 0.12)';
const LIGHT_SURFACE = '#ffffff';

const LIGHT_AXIS_STYLE = {
  color: LIGHT_TEXT_SECONDARY,
  gridcolor: LIGHT_GRID,
  linecolor: LIGHT_GRID,
  tickfont: { color: LIGHT_TEXT_SECONDARY },
  title: { font: { color: LIGHT_TEXT_PRIMARY } },
};

/** Plotly layout fragment for readable charts on light backgrounds (screen and PNG export). */
export const LIGHT_PLOTLY_LAYOUT: Partial<Layout> = {
  paper_bgcolor: LIGHT_SURFACE,
  plot_bgcolor: LIGHT_SURFACE,
  font: { color: LIGHT_TEXT_PRIMARY },
  xaxis: LIGHT_AXIS_STYLE,
  yaxis: LIGHT_AXIS_STYLE,
};
