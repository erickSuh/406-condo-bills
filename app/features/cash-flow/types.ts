export interface CashFlowItem {
  id: number;
  code: string;
  title: string;
  type: FlowType['id'];
  deleted: number;
}
export interface FlowType {
  id: number;
  label: string;
}
