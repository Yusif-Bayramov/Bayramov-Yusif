import Selection from 'vscode';
export interface Config {
  text: string[];
  hasAtLeastOneSelection: boolean;
  hasDestinationForLog: boolean;
  areEmptyInserts: boolean;
  emptyInsertTemplate: string;
}
