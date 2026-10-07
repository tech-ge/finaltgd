import { useEffect } from 'react';

import type { SocketClient } from '../services/websocket/socket';

export function useRedisStream(
  socket: SocketClient | null,
  channel: string | null,
  handler: (channel: string, payload: unknown) => void,
): void {
  useEffect(() => {
    if (!socket || !channel) {
      return;
    }
    socket.connect();
  }, [socket, channel]);

  useEffect(() => {
    void handler;
  }, [handler]);
}
