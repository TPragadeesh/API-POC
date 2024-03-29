export interface TreeNodeModel {
    id: string;
    name: string;
    isDirectory: boolean;
    fileHandle?: FileSystemFileHandle;
    children?: TreeNodeModel[];
  }