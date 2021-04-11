export type Contact = {
  pk: string;
  avatar: string | null;
  displayName: string | null;
};

export interface ReceivedRequest {
  id: string;
  pk: string;
  avatar: string | null;
  displayName: string | null;
  timestamp: number;
}
