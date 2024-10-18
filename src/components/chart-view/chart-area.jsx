import PropTypes from 'prop-types';

import Chart, { useChart } from '../chart/index';

// ----------------------------------------------------------------------

export default function ChartArea ({ series, time }) {
  const chartOptions = useChart({
    xaxis: {
      type: 'datetime',
      categories: time,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  });

  return (
    <Chart dir="ltr" type="area" series={series} options={chartOptions} width="100%" height={320} />
  );
}

ChartArea.propTypes = {
  series: PropTypes.array,
  time: PropTypes.array,
};
