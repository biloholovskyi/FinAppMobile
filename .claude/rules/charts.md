# Charts Rule (Chart.js)

Applies to: `designs/**/*.html` — load only when the screen contains charts or data visualizations.

## CDN (add after Lucide script)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Global Defaults (always set before any chart)

```js
Chart.defaults.color = '#8888AA'; // --text-secondary
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = "'Space Mono', monospace";
Chart.defaults.animation.duration = 1000;
Chart.defaults.animation.easing = 'easeInOutQuart';
```

## Dark Chart Base Config (spread into every chart's options)

```js
const darkChart = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#8888AA',
        font: { family: 'Outfit', size: 12 },
        boxWidth: 10,
        padding: 16,
      }
    },
    tooltip: {
      backgroundColor: '#181828',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderWidth: 1,
      titleColor: '#F2F2FF',
      bodyColor: '#8888AA',
      padding: 12,
      cornerRadius: 8,
      titleFont: { family: 'Outfit', size: 13, weight: '600' },
      bodyFont:  { family: 'Space Mono', size: 12 },
    }
  },
  scales: {
    x: {
      grid:  { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
      ticks: { color: '#8888AA', font: { family: 'Outfit', size: 11 } },
      border: { display: false },
    },
    y: {
      grid:  { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
      ticks: { color: '#8888AA', font: { family: 'Space Mono', size: 11 } },
      border: { display: false },
    }
  }
};
```

## Chart Types for Fintech

### Line Chart — Balance over time
```js
{
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Баланс',
      data: [45000, 52000, 48000, 61000, 58000, 74000],
      borderColor: '#4F9EFF',
      borderWidth: 2,
      pointBackgroundColor: '#4F9EFF',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(79, 158, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(79, 158, 255, 0)');
        return gradient;
      },
      tension: 0.4,
    }]
  },
  options: { ...darkChart }
}
```

### Bar Chart — Income vs Expense
```js
{
  type: 'bar',
  data: {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    datasets: [
      {
        label: 'Доходи',
        data: [0, 12000, 0, 0, 8500, 0, 0],
        backgroundColor: 'rgba(0, 224, 137, 0.6)',
        borderColor: '#00E089',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Витрати',
        data: [3200, 1800, 5400, 2100, 4300, 6700, 1200],
        backgroundColor: 'rgba(255, 75, 107, 0.6)',
        borderColor: '#FF4B6B',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  },
  options: { ...darkChart, barPercentage: 0.6 }
}
```

### Doughnut — Expense categories
```js
{
  type: 'doughnut',
  data: {
    labels: ['Їжа', 'Транспорт', 'Розваги', 'Комунальні', 'Інше'],
    datasets: [{
      data: [35, 20, 18, 15, 12],
      backgroundColor: [
        'rgba(79, 158, 255, 0.8)',
        'rgba(163, 116, 255, 0.8)',
        'rgba(255, 176, 32, 0.8)',
        'rgba(0, 224, 137, 0.8)',
        'rgba(255, 75, 107, 0.8)',
      ],
      borderColor: '#10101C',
      borderWidth: 2,
      hoverOffset: 6,
    }]
  },
  options: {
    ...darkChart,
    cutout: '70%',
    scales: {}, // no axes for doughnut
  }
}
```

### Area Sparkline — Transaction activity (minimal, no axes)
```js
{
  type: 'line',
  data: {
    labels: Array.from({length: 30}, (_, i) => i + 1),
    datasets: [{
      data: [/* 30 values */],
      borderColor: '#4F9EFF',
      borderWidth: 1.5,
      fill: true,
      backgroundColor: 'rgba(79, 158, 255, 0.1)',
      tension: 0.4,
      pointRadius: 0,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: { duration: 1200 },
  }
}
```

## Canvas Sizing

Always set explicit height on the canvas container, not the canvas element:
```html
<div style="height: 180px; position: relative;">
  <canvas id="myChart"></canvas>
</div>
```

## Rules

- Always spread `darkChart` base config into every chart's options
- Always set global defaults before creating any chart instance
- Use gradient fills for line charts (as shown above)
- No chart should have white/default backgrounds
- Doughnut charts: always `cutout: '70%'` (ring style, not pie)
- Animate on load: `duration: 1000`, `easing: 'easeInOutQuart'`
