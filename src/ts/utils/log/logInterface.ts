export default interface ILogInterface {
  debug(primaryMessage: string, ...supportingData: any[]);
  warn(primaryMessage: string, ...supportingData: any[]);
  error(primaryMessage: string, ...supportingData: any[]);
  info(primaryMessage: string, ...supportingData: any[]);
}
