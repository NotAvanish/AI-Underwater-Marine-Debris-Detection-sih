export function downloadJsonReport(scan, detections) {
  const report = { title: 'Underwater Sonar Anomaly Report', generated_at: new Date().toISOString(), scan, detections }
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }))
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${scan.id || 'scan'}-report.json`; anchor.click(); URL.revokeObjectURL(url)
}
