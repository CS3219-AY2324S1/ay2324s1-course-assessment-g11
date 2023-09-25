export type BasicUserDetails = {
  uid: string,
  displayName: string,
  photoUrl: string
}

/**
 * Event names can be referenced as such:
 *     socket.emit(eventNames.userLoggedIn)
 *
 * This is to allow for flexible event name changes
 */
export const eventNames = {
  userLoggedIn: "userLoggedIn",
  userLoggedOut: "userLoggedOut",
  userDeleted: "userDeleted",
  joinEventRoom: "joinEventRoom"
}
export interface ServerToClientEvents {
  // Note: Event names here must match the values in the eventNames dict
  userLoggedIn: (userDetails: BasicUserDetails) => void;
  userLoggedOut: (uid: string) => void;
  userDeleted: (uid: string) => void;
}

export interface ClientToServerEvents {
  joinEventRoom: (eventRoomId : string) => void;
}

export const roomNames = {
  userRoom: "userRoom"
}
