module.exports = {
  apps: [
    {
      name: 'susira-socket',
      cwd: './socket',
      script: 'src/index.js',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '300M',
    },
    {
      name: 'susira-api',
      cwd: './backend',
      script: 'src/server.js',
      env: { NODE_ENV: 'production' },
      max_memory_restart: '500M',
    },
  ],
};
