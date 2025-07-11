const LOG_DELAY = process.env.LOG_DELAY ? parseInt(process.env.LOG_DELAY, 10) : 1000;

console.log(`\x1B[1mFusebox Log Sample\x1b[0m`);
console.log(`> pid: ${process.pid}`);
console.log(`> Delay set to: ${LOG_DELAY}ms`);
console.log("");

setInterval(() => {
  console.log(`Process running - ${new Date().toISOString()}`);
}, LOG_DELAY);
