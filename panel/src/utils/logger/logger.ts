type ILogger = (log: any) => void;

const logger: ILogger = (log) => {
  if (process.env.NODE_ENV === 'development')
    console.log('--------LOGGER--------\n', log, '\n--------LOGGER--------');
};
export default logger;
