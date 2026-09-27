// PM2 process definition for the Multisheets Next.js server.
//
// Run from the project root on the VPS:
//   pm2 start deploy/ecosystem.config.cjs --env production
//   pm2 save && pm2 startup
//
// `next start` serves the pre-built static output on port 3000. It must be
// run as a non-root user so the in-app honeypot scan log
// (var/security/scans.jsonl) stays writable.
module.exports = {
  apps: [
    {
      name: 'multisheets',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/home/uXXXX/domains/multisheets.com/public_html',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      max_memory_restart: '700M',
      error_file: '/home/uXXXX/logs/multisheets-err.log',
      out_file: '/home/uXXXX/logs/multisheets-out.log',
      time: true,
      kill_timeout: 5000,
      max_restarts: 10,
      min_uptime: '20s',
    },
  ],
}
