export interface CashFlowItem {
  id: number;
  code: string;
  title: string;
  type: FlowType['id'];
  deleted: number;
  accepts_entries: number;
  parent_id: number;
}
export interface FlowType {
  id: number;
  label: string;
}
